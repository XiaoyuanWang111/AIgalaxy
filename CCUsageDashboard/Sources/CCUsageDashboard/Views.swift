import Cocoa

class RealTimeView: NSView {
    private let sessionTimeLabel = NSTextField()
    private let tokensLabel = NSTextField()
    private let rateLabel = NSTextField()
    private let costLabel = NSTextField()
    private let timeLeftLabel = NSTextField()
    private let progressBar = NSProgressIndicator()
    
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        wantsLayer = true
        layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.15, alpha: 1.0).cgColor
        layer?.cornerRadius = 12
        
        let title = NSTextField()
        title.stringValue = "实时会话"
        title.font = NSFont.systemFont(ofSize: 18, weight: .bold)
        title.textColor = .white
        title.isEditable = false
        title.isBordered = false
        title.backgroundColor = .clear
        title.frame = NSRect(x: 20, y: 120, width: 200, height: 30)
        addSubview(title)
        
        setupLabel(sessionTimeLabel, frame: NSRect(x: 20, y: 90, width: 200, height: 20))
        setupLabel(tokensLabel, frame: NSRect(x: 20, y: 65, width: 200, height: 20))
        setupLabel(rateLabel, frame: NSRect(x: 20, y: 40, width: 200, height: 20))
        setupLabel(costLabel, frame: NSRect(x: 20, y: 15, width: 200, height: 20))
        
        setupLabel(timeLeftLabel, frame: NSRect(x: 240, y: 90, width: 200, height: 20))
        
        progressBar.style = .bar
        progressBar.minValue = 0
        progressBar.maxValue = 1
        progressBar.frame = NSRect(x: 240, y: 60, width: 300, height: 20)
        progressBar.controlTint = .blueControlTint
        addSubview(progressBar)
    }
    
    private func setupLabel(_ label: NSTextField, frame: NSRect) {
        label.frame = frame
        label.font = NSFont.systemFont(ofSize: 14)
        label.textColor = .white
        label.isEditable = false
        label.isBordered = false
        label.backgroundColor = .clear
        addSubview(label)
    }
    
    func update(with data: RealTimeUsage) {
        let hours = Int(data.sessionTime / 3600)
        let minutes = Int((data.sessionTime.truncatingRemainder(dividingBy: 3600)) / 60)
        
        sessionTimeLabel.stringValue = "会话时间: \(hours)h \(minutes)m"
        tokensLabel.stringValue = "Tokens: \(formatNumber(data.currentTokens)) / \(formatNumber(data.maxTokens))"
        rateLabel.stringValue = "消耗速率: \(formatNumber(Int(data.consumptionRate)))/min"
        costLabel.stringValue = "当前成本: $\(String(format: "%.2f", data.currentCost))"
        
        let leftHours = Int(data.estimatedTimeLeft / 3600)
        let leftMinutes = Int((data.estimatedTimeLeft.truncatingRemainder(dividingBy: 3600)) / 60)
        timeLeftLabel.stringValue = "预计剩余: \(leftHours)h \(leftMinutes)m"
        
        progressBar.doubleValue = data.sessionProgress
    }
    
    private func formatNumber(_ number: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        return formatter.string(from: NSNumber(value: number)) ?? "\(number)"
    }
}

class DailyChartView: NSView {
    private var dailyData: [DailyUsage] = []
    
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        wantsLayer = true
        layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.15, alpha: 1.0).cgColor
        layer?.cornerRadius = 12
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        wantsLayer = true
        layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.15, alpha: 1.0).cgColor
        layer?.cornerRadius = 12
    }
    
    func update(with data: [DailyUsage]) {
        dailyData = data
        needsDisplay = true
    }
    
    override func draw(_ dirtyRect: NSRect) {
        super.draw(dirtyRect)
        
        guard !dailyData.isEmpty else { return }
        
        let context = NSGraphicsContext.current!.cgContext
        context.setFillColor(NSColor(red: 0.2, green: 0.2, blue: 0.2, alpha: 1.0).cgColor)
        context.fill(bounds)
        
        let title = "本月每日使用统计"
        let titleFont = NSFont.systemFont(ofSize: 16, weight: .bold)
        let titleAttributes: [NSAttributedString.Key: Any] = [
            .font: titleFont,
            .foregroundColor: NSColor.white
        ]
        title.draw(at: NSPoint(x: 20, y: bounds.height - 40), withAttributes: titleAttributes)
        
        let chartHeight: CGFloat = 200
        let chartWidth: CGFloat = bounds.width - 40
        let chartY: CGFloat = 20
        let chartX: CGFloat = 20
        
        let maxTokens = dailyData.map { $0.tokens }.max() ?? 1
        let barWidth = chartWidth / CGFloat(dailyData.count)
        
        for (index, day) in dailyData.enumerated() {
            let barHeight = CGFloat(day.tokens) / CGFloat(maxTokens) * chartHeight
            let barX = chartX + CGFloat(index) * barWidth
            let barY = chartY
            
            let barRect = NSRect(x: barX + 2, y: barY, width: barWidth - 4, height: barHeight)
            
            let color = NSColor(
                red: 0.2 + CGFloat(day.tokens) / CGFloat(maxTokens) * 0.5,
                green: 0.4,
                blue: 0.8,
                alpha: 0.8
            )
            
            context.setFillColor(color.cgColor)
            context.fill(barRect)
            
            if dailyData.count <= 15 {
                let dateLabel = day.date.suffix(5)
                let labelFont = NSFont.systemFont(ofSize: 10)
                let labelAttributes: [NSAttributedString.Key: Any] = [
                    .font: labelFont,
                    .foregroundColor: NSColor.lightGray
                ]
                String(dateLabel).draw(
                    at: NSPoint(x: barX + 2, y: chartY - 15),
                    withAttributes: labelAttributes
                )
            }
        }
    }
}

class StatsView: NSView {
    private let totalTokensLabel = NSTextField()
    private let totalCostLabel = NSTextField()
    private let avgDailyLabel = NSTextField()
    private let totalSessionsLabel = NSTextField()
    
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        wantsLayer = true
        layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.15, alpha: 1.0).cgColor
        layer?.cornerRadius = 12
        
        let title = NSTextField()
        title.stringValue = "本月统计"
        title.font = NSFont.systemFont(ofSize: 18, weight: .bold)
        title.textColor = .white
        title.isEditable = false
        title.isBordered = false
        title.backgroundColor = .clear
        title.frame = NSRect(x: 20, y: 120, width: 200, height: 30)
        addSubview(title)
        
        setupLabel(totalTokensLabel, frame: NSRect(x: 20, y: 90, width: 200, height: 20))
        setupLabel(totalCostLabel, frame: NSRect(x: 20, y: 65, width: 200, height: 20))
        setupLabel(avgDailyLabel, frame: NSRect(x: 240, y: 90, width: 200, height: 20))
        setupLabel(totalSessionsLabel, frame: NSRect(x: 240, y: 65, width: 200, height: 20))
    }
    
    private func setupLabel(_ label: NSTextField, frame: NSRect) {
        label.frame = frame
        label.font = NSFont.systemFont(ofSize: 14)
        label.textColor = .white
        label.isEditable = false
        label.isBordered = false
        label.backgroundColor = .clear
        addSubview(label)
    }
    
    func update(with data: [DailyUsage]) {
        let totalTokens = data.reduce(0) { $0 + $1.tokens }
        let totalCost = data.reduce(0) { $0 + $1.cost }
        let totalSessions = data.reduce(0) { $0 + $1.sessions }
        let avgDailyTokens = totalTokens / max(data.count, 1)
        
        totalTokensLabel.stringValue = "总Tokens: \(formatNumber(totalTokens))"
        totalCostLabel.stringValue = "总成本: $\(String(format: "%.2f", totalCost))"
        avgDailyLabel.stringValue = "日均Tokens: \(formatNumber(avgDailyTokens))"
        totalSessionsLabel.stringValue = "总会话: \(totalSessions)"
    }
    
    private func formatNumber(_ number: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        return formatter.string(from: NSNumber(value: number)) ?? "\(number)"
    }
}