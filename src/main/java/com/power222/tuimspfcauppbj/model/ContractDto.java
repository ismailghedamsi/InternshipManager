package com.power222.tuimspfcauppbj.model;

import lombok.Data;

@Data
public class ContractDto {
    private static long studentApplicationId;
    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private String adminName;
    private int totalHoursPerWeek;

    public static ContractDto fromContract(Contract contract) {
        var dto = new ContractDto();
        dto.setAdminName(contract.getAdminName());
        dto.setEngagementCollege(contract.getEngagementCollege());
        dto.setEngagementCompany(contract.getEngagementCompany());
        dto.setEngagementStudent(contract.getEngagementStudent());
        dto.setTotalHoursPerWeek(contract.getTotalHoursPerWeek());
        studentApplicationId = contract.getStudentApplication().getId();
        return dto;

    }
}
