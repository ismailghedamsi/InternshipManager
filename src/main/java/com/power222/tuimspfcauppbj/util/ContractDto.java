package com.power222.tuimspfcauppbj.util;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContractDto {
    private long studentApplicationId;
    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private String adminName;
    private int totalHoursPerWeek;
    private String file;

}
