package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final MailSendingService mailSvc;
    private final RsocketNotificationService notifSvc;

    public NotificationService(MailSendingService mailSvc, RsocketNotificationService notifSvc) {
        this.mailSvc = mailSvc;
        this.notifSvc = notifSvc;
    }

    public void notifyContractCreation(Contract contract) {
        mailSvc.notifyAboutCreation(contract);
    }

    public void notifyContractUpdate(Contract contract) {
        mailSvc.notifyConcernedUsers(contract);
    }

    public void notifyContractDeletion(Contract contract) {
        mailSvc.notifyAboutDeletion(contract);
    }

    public void notifyInternEvaluationCreation(InternEvaluation eval) {
        mailSvc.notifyAboutCreation(eval);
    }
}
