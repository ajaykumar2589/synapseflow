package com.synapseflow.service;

import com.synapseflow.dto.DashboardResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ChatClient chatClient;

    // The @Autowired annotation guarantees Spring will use this constructor
    @Autowired
    public AIService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String getDailyCoachSummary(String username, DashboardResponse stats) {
        String prompt = String.format(
            "You are the SynapseFlow Productivity Coach. " +
            "User: %s. " +
            "Today's Stats: Total Tasks: %d, Completed: %d, In Progress: %d, Todo: %d. " +
            "Provide a brief, motivating 2-sentence summary of their progress and one piece of advice.",
            username, stats.getTotalTasks(), stats.getCompletedTasks(), 
            stats.getInProgressTasks(), stats.getTodoTasks()
        );

        return chatClient.prompt().user(prompt).call().content();
    }
}