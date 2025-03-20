namespace View {
    class MenuWindow : Window {
        MenuWindow() {
            super();
        }

        void Render() {
            if (UI::BeginMenu(Title())) {
                if (UI::MenuItem(ColorStr("Main window", Icons::WindowMaximize), "", Services::Settings.mainWindow.enabled))
                    Services::Settings.mainWindow.enabled = !Services::Settings.mainWindow.enabled;

                if (UI::MenuItem(ColorStr("Medal window"), "", Services::Settings.medalWindow.enabled))
                    Services::Settings.medalWindow.enabled = !Services::Settings.medalWindow.enabled;

                UI::EndMenu();
            }
        }
    }
}