package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.NotificationRepository;
import com.power222.tuimspfcauppbj.model.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class RsocketNotificationService {

    private final Map<Long, List<FluxSink<Notification>>> sinks = new ConcurrentHashMap<>();
    private final NotificationRepository notifRepo;

    public RsocketNotificationService(NotificationRepository notifRepo) {
        this.notifRepo = notifRepo;
    }

    public Flux<Notification> subscribeForUser(long userId) {
        AtomicReference<FluxSink<Notification>> fluxSink = new AtomicReference<>();
        return Flux.<Notification>create(sink -> {
            fluxSink.set(sink);
            initNotifQueue(userId, sink);
        })
                .doOnComplete(() -> sinks.get(userId).remove(fluxSink.get()));
    }

    private void initNotifQueue(long userId, FluxSink<Notification> sink) {
        if (!sinks.containsKey(userId))
            sinks.put(userId, new LinkedList<>());

        sinks.get(userId).add(sink);
        notifRepo.findAllByUserId(userId).forEach(sink::next);
    }

    public void notify(long userId, String message) {
        var notif = new Notification(UUID.randomUUID(), userId, message);

        notifRepo.save(notif);
        if (sinks.containsKey(notif.getUserId()))
            sinks.get(notif.getUserId()).forEach(sink -> sink.next(notif));
    }

    public void subscribeToAcks(Flux<UUID> acks) {
        acks.filter(uuid -> !uuid.equals(UUID.fromString("00000000-0000-0000-0000-000000000000")))
                .subscribe(notifRepo::deleteById);
    }

}
