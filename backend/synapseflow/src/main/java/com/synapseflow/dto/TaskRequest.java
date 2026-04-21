package com.synapseflow.dto;

import com.synapseflow.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDateTime dueDate;
    
    
    private Long userId; 
}