namespace View {
    const float scale = UI::GetScale();

    class Window {
        Window() {}
    }

    string Label(const string&in label, const string&in id, const string&in field) {
        return label + "##" + id + "_" + field;
    }

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

    void Header(const string&in header) {
        UI::PushFont(Services::Fonts.GetHeader());
        UI::Text(header);
        UI::PopFont();
    }

    void SubHeader(const string&in subHeader) {
        UI::PushFont(Services::Fonts.GetSubHeader());
        UI::Text(subHeader);
        UI::PopFont();
    }

    void Tooltip(const string &in msg, const string &in color = "666") {
        UI::SameLine();
        UI::Text("\\$" + color + Icons::QuestionCircle);
        if (!UI::IsItemHovered())
            return;

        UI::SetNextWindowSize(int(Math::Min(Draw::MeasureString(msg).x, 400.0f)), 0.0f);
        UI::BeginTooltip();
        UI::Text(msg);
        UI::EndTooltip();
    }

    void Table(const string&in id, array<string>@ cols, array<Json::Value@>@ data = {}, int flags = UI::TableFlags::RowBg | UI::TableFlags::SizingFixedFit) {
        if (UI::BeginTable(id, cols.Length, flags)) {
            UI::PushStyleColor(UI::Col::TableRowBgAlt, vec4(0.0f, 0.0f, 0.0f, 0.5f));

            UI::TableSetupScrollFreeze(0, 1);
            for (uint i = 0; i < cols.Length; i++) {
                UI::TableSetupColumn(cols[i]);
            }
            UI::TableHeadersRow();

            for (uint i = 0; i < data.Length; i++) {
                auto d = data[i];
                UI::TableNextRow();

                for (uint j = 0; j < cols.Length; j++) {
                    UI::TableNextColumn();
                    if (d.HasKey(cols[j])) {
                        if (d[cols[j]].GetType() == Json::Type::String) {
                            UI::Text(d[cols[j]]);
                        } else {
                            UI::Text(Json::Write(d[cols[j]]));
                        }
                    } else {
                        UI::Text("null");
                    }
                }
            }

            UI::PopStyleColor();
            UI::EndTable();
        }
    }

    SettingsWindow@ Settings = SettingsWindow();;
    MainWindow@ Main = MainWindow();
    MedalWindow@ Medal = MedalWindow();
    MenuWindow@ Menu = MenuWindow();
}