package com.synapseflow.service;

import com.synapseflow.dto.DashboardResponse;
import com.synapseflow.entity.Task;
import com.synapseflow.enums.TaskStatus;
import com.synapseflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;

    public DashboardResponse getUserDashboardStats(Long userId) {
        // 1. Fetch all tasks for this specific user
        List<Task> userTasks = taskRepository.findByUserId(userId);

        // 2. Calculate statistics using modern Java Streams
        long total = userTasks.size();
        
        long completed = userTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                .count();
                
        long inProgress = userTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS)
                .count();
                
        long todo = userTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.TODO)
                .count();

        // 3. Build and return the clean DTO
        return DashboardResponse.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .inProgressTasks(inProgress)
                .todoTasks(todo)
                .build();
    }
}