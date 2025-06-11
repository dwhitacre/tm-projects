namespace View {
    const float scale = UI::GetScale();

    string PlayerName() {
        if (!Services::CurrentPlayer.exists) return "Player";
        return Services::CurrentPlayer.player.viewName;
    }

    string Name() {
        return PlayerName() + " Medals";
    }

    string Title() {
        if (Services::CurrentPlayer.exists) return ColorStr(Name(), Icons::Circle);
        return ColorStr(Name(), Icons::TimesCircle);
    }

    string ColorStr(const string&in message, const string&in icon = Icons::Circle) {
        auto content = icon + "\\$G " + message;
        if (!Services::CurrentPlayer.exists) return "\\$F30" + content;
        return Services::CurrentPlayer.player.colorStr + content;
    }

    vec4 Color() {
        if (!Services::CurrentPlayer.exists) return Text::ParseHexColor("F30");
        return Text::ParseHexColor(Services::CurrentPlayer.player.color);
    }

    SettingsWindow@ Settings = SettingsWindow();;
    MainWindow@ Main = MainWindow();
    MedalWindow@ Medal = MedalWindow();
    MenuWindow@ Menu = MenuWindow();
}