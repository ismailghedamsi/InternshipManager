package com.power222.tuimspfcauppbj.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContractDto {
    private long studentApplicationId;
    private String engagementCollege;
    private String engagementCompany;
    private String engagementStudent;
    private String adminName;
    private int totalHoursPerWeek;
    private String file;
}
