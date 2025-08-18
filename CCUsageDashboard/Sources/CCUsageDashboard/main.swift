import Foundation
import AppKit

@main
struct CCUsageDashboardApp {
    static func main() {
        let app = NSApplication.shared
        let delegate = AppDelegate()
        app.delegate = delegate
        app.run()
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    var dashboardViewController: DashboardViewController!
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        setupWindow()
        setupMenu()
    }
    
    func setupWindow() {
        let windowSize = NSSize(width: 1000, height: 700)
        window = NSWindow(
            contentRect: NSRect(origin: .zero, size: windowSize),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        
        window.center()
        window.title = "Claude Code Usage Dashboard"
        window.backgroundColor = NSColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0)
        
        dashboardViewController = DashboardViewController()
        window.contentViewController = dashboardViewController
        
        window.makeKeyAndOrderFront(nil)
    }
    
    func setupMenu() {
        let mainMenu = NSMenu()
        let appMenu = NSMenu()
        let appMenuItem = NSMenuItem()
        appMenuItem.submenu = appMenu
        mainMenu.addItem(appMenuItem)
        
        let quitItem = NSMenuItem(
            title: "Quit CCUsage Dashboard",
            action: #selector(NSApplication.terminate(_:)),
            keyEquivalent: "q"
        )
        appMenu.addItem(quitItem)
        
        NSApp.mainMenu = mainMenu
    }
}

class DashboardViewController: NSViewController {
    private var dataFetcher = CCUsageDataFetcher()
    private var refreshTimer: Timer?
    
    private let realTimeView = RealTimeView()
    private let dailyChartView = DailyChartView()
    private let statsView = StatsView()
    
    override func loadView() {
        view = NSView(frame: NSRect(x: 0, y: 0, width: 1000, height: 700))
        view.wantsLayer = true
        view.layer?.backgroundColor = NSColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0).cgColor
        
        setupUI()
        startAutoRefresh()
    }
    
    func setupUI() {
        realTimeView.frame = NSRect(x: 20, y: 500, width: 960, height: 160)
        dailyChartView.frame = NSRect(x: 20, y: 200, width: 960, height: 280)
        statsView.frame = NSRect(x: 20, y: 20, width: 960, height: 160)
        
        view.addSubview(realTimeView)
        view.addSubview(dailyChartView)
        view.addSubview(statsView)
        
        refreshData()
    }
    
    func startAutoRefresh() {
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { [weak self] _ in
            self?.refreshData()
        }
    }
    
    func refreshData() {
        Task {
            let dailyData = await dataFetcher.fetchDailyUsage()
            let realTimeData = await dataFetcher.fetchRealTimeUsage()
            
            await MainActor.run {
                realTimeView.update(with: realTimeData)
                dailyChartView.update(with: dailyData)
                statsView.update(with: dailyData)
            }
        }
    }
    
    deinit {
        refreshTimer?.invalidate()
    }
}