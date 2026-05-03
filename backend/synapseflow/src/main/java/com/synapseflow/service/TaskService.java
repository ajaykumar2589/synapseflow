package com.synapseflow.service;

import com.synapseflow.dto.TaskRequest;
import com.synapseflow.entity.Task;
import com.synapseflow.entity.User;
import com.synapseflow.repository.TaskRepository;
import com.synapseflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.synapseflow.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional
    public Task createTask(TaskRequest request) {
        // Validate the user exists before assigning a task to them
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Page<Task> getTasksByUserId(Long userId, int page, int size) {
        // Sort by due date ascending so the most urgent tasks appear first
        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
        return taskRepository.findByUserId(userId, pageable);
    }

    @Transactional(readOnly = true)
   public Task getTaskById(Long taskId) {
    return taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
}

    @Transactional
    public Task updateTask(Long taskId, TaskRequest request) {
        Task existingTask = getTaskById(taskId); // Reuses the method above to find or throw exception

        // Update fields
        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());
        existingTask.setStatus(request.getStatus());
        existingTask.setDueDate(request.getDueDate());

        // We don't update the user; a task shouldn't generally be reassigned to another user in this system
        return taskRepository.save(existingTask);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task existingTask = getTaskById(taskId);
        taskRepository.delete(existingTask);
    }
}