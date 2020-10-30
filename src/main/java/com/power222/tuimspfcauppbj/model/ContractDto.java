package com.power222.tuimspfcauppbj.model;

import lombok.Data;

@Data
public class ContractDto {
    private long studentApplicationId;
    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private String adminName;
    private int totalHoursPerWeek;
    private String file;

}
