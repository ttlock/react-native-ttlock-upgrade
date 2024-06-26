require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-ttlock-upgrade"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/ttlock/react-native-ttlock-upgrade.git", :tag => "#{s.version}" }

  
  s.source_files = "ios/**/*.{h,m,mm,swift}"
  

  s.dependency "React-Core"

    #TTLockDFU 依赖
    s.platform = :ios, '9.0'
    s.dependency 'TTLockDFU', '3.3.4'
    s.static_framework = true
end
