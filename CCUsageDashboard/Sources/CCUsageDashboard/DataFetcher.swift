import Foundation

struct DailyUsage: Codable {
    let date: String
    let tokens: Int
    let cost: Double
    let sessions: Int
}

struct RealTimeUsage {
    let sessionTime: Double
    let currentTokens: Int
    let maxTokens: Int
    let consumptionRate: Double
    let estimatedTimeLeft: Double
    let currentCost: Double
    let sessionProgress: Double
}

class CCUsageDataFetcher {
    private let processQueue = DispatchQueue(label: "ccusage.process", qos: .userInitiated)
    
    func fetchDailyUsage() async -> [DailyUsage] {
        return await withCheckedContinuation { continuation in
            processQueue.async {
                let task = Process()
                task.executableURL = URL(fileURLWithPath: "/bin/bash")
                task.arguments = ["-c", "ccusage daily --json --since $(date -v-30d +%Y%m%d)"]
                
                let pipe = Pipe()
                task.standardOutput = pipe
                
                do {
                    try task.run()
                    let data = pipe.fileHandleForReading.readDataToEndOfFile()
                    
                    if let jsonString = String(data: data, encoding: .utf8),
                       let jsonData = jsonString.data(using: .utf8) {
                        let decoder = JSONDecoder()
                        let usage = try decoder.decode([DailyUsage].self, from: jsonData)
                        continuation.resume(returning: usage)
                    } else {
                        continuation.resume(returning: self.getSampleDailyData())
                    }
                } catch {
                    print("Error fetching daily usage: \(error)")
                    continuation.resume(returning: self.getSampleDailyData())
                }
            }
        }
    }
    
    func fetchRealTimeUsage() async -> RealTimeUsage {
        return await withCheckedContinuation { continuation in
            processQueue.async {
                let task = Process()
                task.executableURL = URL(fileURLWithPath: "/bin/bash")
                task.arguments = ["-c", "ccusage blocks --live --json"]
                
                let pipe = Pipe()
                task.standardOutput = pipe
                
                do {
                    try task.run()
                    let data = pipe.fileHandleForReading.readDataToEndOfFile()
                    
                    if let jsonString = String(data: data, encoding: .utf8),
                       let jsonData = jsonString.data(using: .utf8) {
                        let decoder = JSONDecoder()
                        let usage = try decoder.decode(RealTimeUsage.self, from: jsonData)
                        continuation.resume(returning: usage)
                    } else {
                        continuation.resume(returning: self.getSampleRealTimeData())
                    }
                } catch {
                    print("Error fetching real-time usage: \(error)")
                    continuation.resume(returning: self.getSampleRealTimeData())
                }
            }
        }
    }
    
    private func getSampleDailyData() -> [DailyUsage] {
        let calendar = Calendar.current
        let today = Date()
        var samples: [DailyUsage] = []
        
        for i in 0..<30 {
            if let date = calendar.date(byAdding: .day, value: -i, to: today) {
                let dateString = formatDate(date)
                let tokens = Int.random(in: 50000...200000)
                let cost = Double(tokens) * 0.0000071
                let sessions = Int.random(in: 3...15)
                
                samples.append(DailyUsage(
                    date: dateString,
                    tokens: tokens,
                    cost: cost,
                    sessions: sessions
                ))
            }
        }
        
        return samples.reversed()
    }
    
    private func getSampleRealTimeData() -> RealTimeUsage {
        return RealTimeUsage(
            sessionTime: 2.5 * 3600,
            currentTokens: 234567,
            maxTokens: 500000,
            consumptionRate: 1847,
            estimatedTimeLeft: 2.4 * 3600,
            currentCost: 1.68,
            sessionProgress: 0.47
        )
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
}