namespace View {
    class MainWindow : Window {
        MainWindow() {
            super();
        }

        void Render() {            
            if (!Services::Settings.mainWindow.enabled) return;
            if (!Services::Settings.mainWindow.showWithGame && !UI::IsGameUIVisible()) return;
            if (!Services::Settings.mainWindow.showWithOpenplanet && !UI::IsOverlayShown()) return;

            if (UI::Begin(Title() + "##mainwindow", Services::Settings.mainWindow.enabled, (Services::Settings.mainWindow.autoResize ? UI::WindowFlags::AlwaysAutoResize : UI::WindowFlags::None) | UI::WindowFlags::NoCollapse)) {
                UI::PushStyleColor(UI::Col::Button, Color() - vec4(vec3(0.2f), 0.0f));
                UI::PushStyleColor(UI::Col::ButtonActive, Color() - vec4(vec3(0.4f), 0.0f));
                UI::PushStyleColor(UI::Col::ButtonHovered, Color());

                if (UI::BeginTable("##table-main-header", 3, UI::TableFlags::SizingStretchProp)) {
                    UI::TableSetupColumn("total",   UI::TableColumnFlags::WidthStretch);
                    UI::TableSetupColumn("refresh", UI::TableColumnFlags::WidthFixed);
                    UI::TableSetupColumn("reset cache", UI::TableColumnFlags::WidthFixed);

                    UI::TableNextRow();

                    UI::TableNextColumn();
                    UI::PushFont(Services::Fonts.GetHeader());
                    UI::Image(Services::Icons.GetIcon32(), vec2(scale * 32.0f));
                    UI::SameLine();
                    UI::AlignTextToFramePadding();

                    auto medalTimes = Services::CurrentPlayer.GetMedalTimes();
                    for (uint i = 0; i < medalTimes.Length; i++) {
                        Domain::MedalTime@ medalTime = cast<Domain::MedalTime@>(medalTimes[i]);
                        Domain::PB@ pb = Services::PBs.GetPB(medalTime.mapUid);

                        if (pb !is null && pb.HasMedalTime(medalTime)) Services::CurrentPlayer.medalTimes.Set(medalTime.mapUid, @medalTime);
                        else Services::CurrentPlayer.medalTimes.Remove(medalTime.mapUid);
                    }

                    UI::Text(Services::CurrentPlayer.medalTimes.Length + " / " + medalTimes.Length);
                    UI::PopFont();

                    UI::BeginDisabled(Services::Loading);
                    UI::TableNextColumn();
                    if (UI::Button(Icons::Refresh + " Refresh")) {
                        trace("Refreshing services");
                        startnew(Services::LoadServices);
                    }
                    UI::TableNextColumn();
                    if (UI::Button(Icons::Trash + " Reset Cache")) {
                        trace("Resetting services");
                        startnew(Services::Reset);
                    }
                    UI::EndDisabled();

                    UI::EndTable();
                }

                UI::PushStyleColor(UI::Col::Tab, Color() - vec4(vec3(0.4f), 0.0f));
                UI::PushStyleColor(UI::Col::TabActive, Color() - vec4(vec3(0.15f), 0.0f));
                UI::PushStyleColor(UI::Col::TabHovered, Color() - vec4(vec3(0.15f), 0.0f));

                UI::BeginTabBar("##tab-bar");

                RenderTabSeasonal();
                RenderTabTotd();
                RenderTabOther();

                UI::EndTabBar();

                UI::PopStyleColor(6);

                UI::End();
            }
        }

        void RenderTabSeasonal() {
            if (!UI::BeginTabItem(Icons::SnowflakeO + " Seasonal")) return;

            bool selected = false;

            UI::BeginTabBar("##tab-bar-seasonal");
            if (UI::BeginTabItem(Icons::List + " List")) {
                uint lastYear = 0;

                auto campaignsArr = Services::Maps.GetCampaigns();
                for (uint i = 0; i < campaignsArr.Length; i++) {
                    auto campaign = cast<Domain::Campaign@>(campaignsArr[i]);
                    if (campaign is null || campaign.type != Domain::CampaignType::Seasonal)
                        continue;

                    if (lastYear != campaign.year) {
                        UI::PushFont(Services::Fonts.GetHeader());
                        UI::SeparatorText(tostring(campaign.year + 2020));
                        UI::PopFont();

                        lastYear = campaign.year;
                    } else
                        UI::SameLine();

                    bool colored = false;
                    if (Services::Settings.colors.seasons.Length == 4 && campaign.colorIndex < 4) {
                        UI::PushStyleColor(UI::Col::Button, vec4(Services::Settings.colors.seasons[campaign.colorIndex] - vec3(0.1f), 1.0f));
                        UI::PushStyleColor(UI::Col::ButtonActive, vec4(Services::Settings.colors.seasons[campaign.colorIndex] - vec3(0.4f), 1.0f));
                        UI::PushStyleColor(UI::Col::ButtonHovered, vec4(Services::Settings.colors.seasons[campaign.colorIndex], 1.0f));
                        colored = true;
                    }

                    if (UI::Button(campaign.name.SubStr(0, campaign.name.Length - 5) + "##" + campaign.name, vec2(scale * 100.0f, scale * 25.0f))) {
                        @Services::CurrentPlayer.activeCampaign = @campaign;                
                        Services::CurrentPlayer.activeCampaignMedalTimes.Clear();
                        Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Clear();
                        selected = true;
                    }

                    if (colored) UI::PopStyleColor(3);
                }

                UI::EndTabItem();
            }

            if (!RenderTabSingleCampaign(@Services::CurrentPlayer.activeCampaign, selected)) {
                @Services::CurrentPlayer.activeCampaign = null;
                Services::CurrentPlayer.activeCampaignMedalTimes.Clear();
                Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Clear();
            }


            UI::EndTabBar();
            UI::EndTabItem();
        }

        bool RenderTabSingleCampaign(Domain::Campaign@ campaign, bool selected) {
            bool open = campaign !is null;

            if (!open || !UI::BeginTabItem(campaign.name, open, selected ? UI::TabItemFlags::SetSelected : UI::TabItemFlags::None))
                return open;

            if (UI::BeginTable("##table-campaign-header", 2, UI::TableFlags::SizingStretchProp)) {
                UI::TableSetupColumn("name", UI::TableColumnFlags::WidthStretch);
                UI::TableSetupColumn("count", UI::TableColumnFlags::WidthFixed);

                UI::PushFont(Services::Fonts.GetHeader());

                UI::TableNextRow();

                UI::TableNextColumn();
                UI::AlignTextToFramePadding();
                UI::SeparatorText(campaign.name);

                UI::TableNextColumn();
                UI::Image(Services::Icons.GetIcon32(), vec2(scale * 32.0f));
                UI::SameLine();
                UI::Text(Services::CurrentPlayer.activeCampaignMedalTimes.Length + " / " + Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Length + " ");

                UI::PopFont();

                UI::EndTable();
            }

            if (UI::BeginTable("##table-campaign-maps", Services::Me.hasPlayPermission ? 5 : 4, UI::TableFlags::RowBg | UI::TableFlags::ScrollY | UI::TableFlags::SizingStretchProp)) {
                UI::PushStyleColor(UI::Col::TableRowBgAlt, vec4(vec3(0.0f), 0.5f));

                UI::TableSetupScrollFreeze(0, 1);
                UI::TableSetupColumn("Name",    UI::TableColumnFlags::WidthStretch);
                UI::TableSetupColumn("Medal Time", UI::TableColumnFlags::WidthFixed, scale * 75.0f);
                UI::TableSetupColumn("PB",      UI::TableColumnFlags::WidthFixed, scale * 75.0f);
                UI::TableSetupColumn("Delta",   UI::TableColumnFlags::WidthFixed, scale * 75.0f);
                if (Services::Me.hasPlayPermission)
                    UI::TableSetupColumn("Play", UI::TableColumnFlags::WidthFixed, scale * 30.0f);
                UI::TableHeadersRow();

                for (uint i = 0; i < campaign.maps.Length; i++) {
                    Domain::Map@ map = cast<Domain::Map@>(campaign.maps.GetByIndex(i));
                    Domain::MedalTime@ medalTime = Services::CurrentPlayer.GetMedalTime(map.mapUid);
                    if (medalTime is null)
                        Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Remove(map.mapUid);
                    else Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Set(map.mapUid, @medalTime);

                    Domain::PB@ pb = Services::PBs.GetPB(map.mapUid);

                    UI::TableNextRow();

                    UI::TableNextColumn();
                    UI::AlignTextToFramePadding();
                    UI::Text(map.name);

                    UI::TableNextColumn();
                    UI::Text(medalTime is null ? "" : Time::Format(medalTime.time));

                    UI::TableNextColumn();
                    if (pb is null) {
                        UI::Text(Services::PBsLoading ? "Loading.." : "");
                    } else {
                        if (pb.HasMedalTime(medalTime)) Services::CurrentPlayer.activeCampaignMedalTimes.Set(map.mapUid, @medalTime);
                        else Services::CurrentPlayer.activeCampaignMedalTimes.Remove(map.mapUid);
                        UI::Text(Time::Format(pb.score));
                    }

                    UI::TableNextColumn();
                    if (medalTime is null) UI::Text("");
                    else UI::Text(pb is null ? "" : (pb.HasMedalTime(medalTime) ? "\\$77F\u2212" : "\\$F77+") + Time::Format(uint(Math::Abs(pb.score - medalTime.time))));

                    if (Services::Me.hasPlayPermission) {
                        UI::TableNextColumn();
                        UI::BeginDisabled(Services::MapLoading || Services::Loading);
                        if (UI::Button(Icons::Play + "##" + map.name))
                            startnew(Services::Game::PlayMapAsync, map.mapUid);
                        UI::EndDisabled();
                        Tooltip("Play " + map.name);
                    }
                }

                UI::TableNextRow();

                UI::PopStyleColor();
                UI::EndTable();
            }

            UI::EndTabItem();
            return open;
        }

        void RenderTabTotd() {
            if (!UI::BeginTabItem(Icons::Calendar + " Track of the Day"))
                return;

            bool selected = false;

            UI::BeginTabBar("##tab-bar-totd");
            if (UI::BeginTabItem(Icons::List + " List")) {
                uint lastYear = 0;

                auto campaignsArr = Services::Maps.GetCampaigns();
                for (uint i = 0; i < campaignsArr.Length; i++) {
                    auto campaign = cast<Domain::Campaign@>(campaignsArr[i]);
                    if (campaign is null || campaign.type != Domain::CampaignType::TrackOfTheDay)
                        continue;

                    if (lastYear != campaign.year) {
                        if (lastYear > 0) UI::NewLine();
                        UI::PushFont(Services::Fonts.GetHeader());
                        UI::SeparatorText(tostring(campaign.year + 2020));
                        UI::PopFont();
                        
                        lastYear = campaign.year;
                    }

                    bool colored = false;
                    if (Services::Settings.colors.seasons.Length == 4 && campaign.colorIndex < 4) {
                        UI::PushStyleColor(UI::Col::Button, vec4(Services::Settings.colors.seasons[campaign.colorIndex] - vec3(0.1f), 1.0f));
                        UI::PushStyleColor(UI::Col::ButtonActive, vec4(Services::Settings.colors.seasons[campaign.colorIndex] - vec3(0.4f), 1.0f));
                        UI::PushStyleColor(UI::Col::ButtonHovered, vec4(Services::Settings.colors.seasons[campaign.colorIndex], 1.0f));
                        colored = true;
                    }

                    if (UI::Button(campaign.name.SubStr(0, campaign.name.Length - 5) + "##" + campaign.name, vec2(scale * 100.0f, scale * 25.0f))) {
                        @Services::CurrentPlayer.activeCampaign = @campaign;
                        Services::CurrentPlayer.activeCampaignMedalTimes.Clear();
                        Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Clear();
                        selected = true;
                    }

                    if (colored) UI::PopStyleColor(3);

                    if ((campaign.month - 1) % 3 > 0)
                        UI::SameLine();
                }

                UI::EndTabItem();
            }

            if (!RenderTabSingleCampaign(@Services::CurrentPlayer.activeCampaign, selected)) {
                @Services::CurrentPlayer.activeCampaign = null;
                Services::CurrentPlayer.activeCampaignMedalTimes.Clear();
                Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Clear();
            }

            UI::EndTabBar();
            UI::EndTabItem();
        }

        void RenderTabOther() {
            if (!UI::BeginTabItem(Icons::QuestionCircle + " Other"))
                return;

            bool selected = false;

            UI::BeginTabBar("##tab-bar-totd");
            if (UI::BeginTabItem(Icons::List + " List")) {
                UI::PushFont(Services::Fonts.GetHeader());
                UI::SeparatorText("Official");
                UI::PopFont();

                uint index = 0;
                auto campaignsArr = Services::Maps.GetCampaigns();
                for (uint i = 0; i < campaignsArr.Length; i++) {
                    auto campaign = cast<Domain::Campaign@>(campaignsArr[i]);
                    if (campaign is null || campaign.type != Domain::CampaignType::Other)
                        continue;

                    if (index++ % 3 > 0)
                        UI::SameLine();

                    if (UI::Button(campaign.name, vec2(scale * 120.0f, scale * 25.0f))) {
                        @Services::CurrentPlayer.activeCampaign = @campaign;
                        Services::CurrentPlayer.activeCampaignMedalTimes.Clear();
                        Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Clear();
                        selected = true;
                    }
                }

                UI::PushFont(Services::Fonts.GetHeader());
                UI::SeparatorText("Other");
                UI::PopFont();

                index = 0;
                for (uint i = 0; i < campaignsArr.Length; i++) {
                    auto campaign = cast<Domain::Campaign@>(campaignsArr[i]);
                    if (campaign is null || campaign.type != Domain::CampaignType::Unknown)
                        continue;

                    if (index++ % 3 > 0)
                        UI::SameLine();

                    if (UI::Button(campaign.name, vec2(scale * 120.0f, scale * 25.0f))) {
                        @Services::CurrentPlayer.activeCampaign = @campaign;
                        Services::CurrentPlayer.activeCampaignMedalTimes.Clear();
                        Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Clear();
                        selected = true;
                    }
                }

                UI::EndTabItem();
            }

            if (!RenderTabSingleCampaign(@Services::CurrentPlayer.activeCampaign, selected)) {
                @Services::CurrentPlayer.activeCampaign = null;
                Services::CurrentPlayer.activeCampaignMedalTimes.Clear();
                Services::CurrentPlayer.activeCampaignAvailableMedalTimes.Clear();
            }

            UI::EndTabBar();
            UI::EndTabItem();
        }
    }
}
