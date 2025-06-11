namespace View {
    class Window {
        Window() {}
    }

    string Label(const string&in label, const string&in id, const string&in field) {
        return label + "##" + id + "_" + field;
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
}