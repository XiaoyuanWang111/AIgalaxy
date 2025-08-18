// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CCUsageDashboard",
    platforms: [.macOS(.v12)],
    products: [
        .executable(name: "CCUsageDashboard", targets: ["CCUsageDashboard"])
    ],
    dependencies: [
        .package(url: "https://github.com/swift-server/swift-backtrace.git", from: "1.3.0"),
    ],
    targets: [
        .executableTarget(
            name: "CCUsageDashboard",
            dependencies: [
                .product(name: "Backtrace", package: "swift-backtrace")
            ]
        )
    ]
)