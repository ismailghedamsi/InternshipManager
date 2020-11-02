package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.service.ContractSignatureService;
import com.power222.tuimspfcauppbj.util.ContractSignatureDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContractSignatureServiceTest {
    @Mock
    private ContractSignatureService svc;

    private Contract expectedContract;
    private ContractSignatureDTO dto;

    @BeforeEach
    void setUp() {
        expectedContract = Contract.builder()
                .id(1L)
                .build();

        dto = ContractSignatureDTO.builder().build();
    }

    @Test
    void signContractTest() {
        when(svc.signContract(expectedContract, dto)).thenReturn(expectedContract);

        var actual = svc.signContract(expectedContract, dto);

        assertThat(actual).isEqualTo(expectedContract);
    }
}
