package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import lombok.Data;

import java.util.stream.Collectors;

@Data
public class ContractDto {
    private long studentApplicationId;
    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private String adminName;
    private int totalHoursPerWeek;
    private String file;
    private StudentApplicationService studentApplicationService;

    public static ContractDto fromContract(Contract contract, StudentApplicationService studentApplicationService) {
        var dto = new ContractDto();
        dto.setAdminName(contract.getAdminName());
        dto.setEngagementCollege(contract.getEngagementCollege());
        dto.setEngagementCompany(contract.getEngagementCompany());
        dto.setEngagementStudent(contract.getEngagementStudent());
        dto.setTotalHoursPerWeek(contract.getTotalHoursPerWeek());
        dto.setFile(contract.getFile());
        dto.setStudentApplicationId(contract.getStudentApplication().getId());
        return dto;
    }

    public static Contract toContract(ContractDto contractDto, StudentApplicationService studentApplicationService) {
        Contract contract = new Contract();
        contract.setAdminName(contractDto.getAdminName());
        contract.setFile(contractDto.getFile());
        contract.setEngagementCollege(contractDto.getEngagementCollege());
        contract.setEngagementCompany(contractDto.getEngagementCompany());
        contract.setEngagementStudent(contractDto.getEngagementStudent());
        contract.setTotalHoursPerWeek(contractDto.getTotalHoursPerWeek());
        StudentApplication application = studentApplicationService.getAllApplication().stream()
                .filter(studentApplication -> studentApplication.getId() == contractDto.getStudentApplicationId())
                .collect(Collectors.toList()).get(0);
        contract.setStudentApplication(application);
        return contract;
    }
}
