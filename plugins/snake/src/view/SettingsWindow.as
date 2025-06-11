[SettingsTab name="Dev" icon="Bug" order=3]
void Settings_Debug() {
    View::Settings.RenderDebug();
}

namespace View {
    class SettingsWindow : Window {
        SettingsWindow() {
            super();
        }

        void RenderDebug() {
            if (UI::Button("Reset to default##api")) {
                Services::Settings.options.Reset();
            }
            Tooltip("Reload the plugin after changing these settings.");

            Services::Settings.options.baseUrl = UI::InputText("Base Url", Services::Settings.options.baseUrl);
            Services::Settings.options.apikey = UI::InputText("API Key", Services::Settings.options.apikey, false, UI::InputTextFlags::Password);
            auto value = UI::InputInt("Latency", Services::Settings.options.latency);
            if (value >= 0) Services::Settings.options.latency = value;
            Services::Settings.options.debug = UI::Checkbox("API Debug", Services::Settings.options.debug);
            Services::Settings.gameplayDebug = UI::Checkbox("Gameplay Debug", Services::Settings.gameplayDebug);
        }
    }
}