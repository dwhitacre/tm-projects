namespace View {
    uint FrameConfirmQuit = 0;
    const float stdRatio = 16.0f / 9.0f;

    enum PlaygroundPageType {
        Record,
        Start,
        Pause,
        End
    }

    void RenderUIMedals() {
        if (!Services::Settings.uiMedals.IsEnabled()) return;
        
        CTrackMania@ App = cast<CTrackMania@>(GetApp());

        NGameLoadProgress_SMgr@ LoadProgress = App.LoadProgress;
        if (LoadProgress !is null && LoadProgress.State != NGameLoadProgress::EState::Disabled)
            return;

        CDx11Viewport@ Viewport = cast<CDx11Viewport@>(App.Viewport);
        if (Viewport is null || Viewport.Overlays.Length == 0)
            return;

        for (int i = Viewport.Overlays.Length - 1; i >= 0; i--) {
            CHmsZoneOverlay@ Overlay = Viewport.Overlays[i];
            if (Overlay is null
                || Overlay.m_CorpusVisibles.Length == 0
                || Overlay.m_CorpusVisibles[0] is null
                || Overlay.m_CorpusVisibles[0].Item is null
                || Overlay.m_CorpusVisibles[0].Item.SceneMobil is null
            )
                continue;

            if (FrameConfirmQuit > 0 && FrameConfirmQuit == Overlay.m_CorpusVisibles[0].Item.SceneMobil.Id.Value)
                return;

            if (Overlay.m_CorpusVisibles[0].Item.SceneMobil.IdName == "FrameConfirmQuit") {
                FrameConfirmQuit = Overlay.m_CorpusVisibles[0].Item.SceneMobil.Id.Value;
                return;
            }
        }

        CTrackManiaNetwork@ Network = cast<CTrackManiaNetwork@>(App.Network);
        CTrackManiaNetworkServerInfo@ ServerInfo = cast<CTrackManiaNetworkServerInfo@>(Network.ServerInfo);

        if (Services::Game::InMap()) {
            if (!UI::IsGameUIVisible()) return;

            auto mapUid = App.RootMap.EdChallengeId;
            Domain::MedalTime@ medalTime = Services::CurrentPlayer.GetMedalTime(mapUid);
            Domain::PB@ pb = Services::PBs.GetPB(mapUid);
            if (pb is null) return;
            if (!pb.HasMedalTime(medalTime)) return;

            CGameManiaAppPlayground@ CMAP = Network.ClientManiaAppPlayground;
            if (CMAP is null
                || CMAP.UILayers.Length < 23
                || CMAP.UI is null
            )
                return;

            const bool endSequence = CMAP.UI.UISequence == CGamePlaygroundUIConfig::EUISequence::EndRound;
            const bool startSequence = CMAP.UI.UISequence == CGamePlaygroundUIConfig::EUISequence::Intro
                || CMAP.UI.UISequence == CGamePlaygroundUIConfig::EUISequence::RollingBackgroundIntro
                || endSequence;
            const bool lookForBanner = ServerInfo.CurGameModeStr.Contains("_Online") || ServerInfo.CurGameModeStr.Contains("PlayMap");

            CGameManialinkPage@ ScoresTable;
            CGameManialinkPage@ Record;
            CGameManialinkPage@ Start;
            CGameManialinkPage@ Pause;
            CGameManialinkPage@ End;

            for (uint i = 0; i < CMAP.UILayers.Length; i++) {
                const bool pauseDisplayed = Services::Settings.uiMedals.pause && Network.PlaygroundClientScriptAPI.IsInGameMenuDisplayed;

                if (!(Record is null && Services::Settings.uiMedals.banner && lookForBanner)
                    && !(Start is null && Services::Settings.uiMedals.start && startSequence)
                    && !(Pause is null && pauseDisplayed)
                    && !(End is null && Services::Settings.uiMedals.end && endSequence)
                )
                    break;

                CGameUILayer@ Layer = CMAP.UILayers[i];
                if (Layer is null) continue;
                if (!Layer.IsVisible) continue;
                if (Layer.Type != CGameUILayer::EUILayerType::Normal && Layer.Type != CGameUILayer::EUILayerType::InGameMenu) continue;
                if (Layer.ManialinkPageUtf8.Length == 0) continue;

                const string pageName = Layer.ManialinkPageUtf8.Trim().SubStr(0, 64);
                if (pauseDisplayed
                    && ScoresTable is null
                    && Layer.Type == CGameUILayer::EUILayerType::Normal
                    && pageName.Contains("_Race_ScoresTable")
                ) {
                    @ScoresTable = Layer.LocalPage;
                    continue;
                }

                if (lookForBanner
                    && !startSequence
                    && Services::Settings.uiMedals.banner
                    && Record is null
                    && Layer.Type == CGameUILayer::EUILayerType::Normal
                    && pageName.Contains("_Race_Record")
                ) {
                    @Record = Layer.LocalPage;
                    continue;
                }

                if (startSequence
                    && Services::Settings.uiMedals.start
                    && Start is null
                    && Layer.Type == CGameUILayer::EUILayerType::Normal
                    && pageName.Contains("_StartRaceMenu")
                ) {
                    @Start = Layer.LocalPage;
                    continue;
                }

                if (Services::Settings.uiMedals.pause
                    && Pause is null
                    && Layer.Type == CGameUILayer::EUILayerType::InGameMenu
                    && pageName.Contains("_PauseMenu")
                ) {
                    @Pause = Layer.LocalPage;
                    continue;
                }

                if (endSequence
                    && Services::Settings.uiMedals.end
                    && End is null
                    && Layer.Type == CGameUILayer::EUILayerType::Normal
                    && pageName.Contains("_EndRaceMenu")
                ) {
                    @End = Layer.LocalPage;
                    continue;
                }
            }

            RenderPlaygroundPage(Record, PlaygroundPageType::Record);
            RenderPlaygroundPage(Start);
            RenderPlaygroundPage(Pause, PlaygroundPageType::Pause, ScoresTable);
            RenderPlaygroundPage(End, PlaygroundPageType::End);

            return;
        }

        if (ServerInfo.CurGameModeStr.Length > 0)
            return;

        CTrackManiaMenus@ Menus = cast<CTrackManiaMenus@>(App.MenuManager);
        if (Menus is null)
            return;

        CGameManiaAppTitle@ Title = Menus.MenuCustom_CurrentManiaApp;
        if (Title is null || Title.UILayers.Length == 0)
            return;

        CGameManialinkPage@ Campaign;
        CGameManialinkPage@ LiveCampaign;
        // CGameManialinkPage@ LiveTotd;
        CGameManialinkPage@ Totd;
        CGameManialinkPage@ Training;

        for (uint i = 0; i < Title.UILayers.Length; i++) {
            if (!(Campaign is null && (Services::Settings.uiMedals.seasonalCampaign || Services::Settings.uiMedals.clubCampaign))
                && !(LiveCampaign is null && Services::Settings.uiMedals.liveCampaign)
                && !(Totd is null && Services::Settings.uiMedals.totd)
                // && !(LiveTotd is null && Services::Settings.uiMedals.liveTotd)
                && !(Training is null && Services::Settings.uiMedals.training)
            )
                break;

            CGameUILayer@ Layer = Title.UILayers[i];
            if (Layer is null) continue;
            if (Layer.LocalPage is null) continue;
            if (!Layer.IsVisible) continue;
            if (Layer.Type != CGameUILayer::EUILayerType::Normal) continue;
            if (Layer.ManialinkPageUtf8.Length == 0) continue;

            const string pageName = Layer.ManialinkPageUtf8.Trim().SubStr(17, 27);

            if (pageName.StartsWith("Overlay_ReportSystem")) {
                CGameManialinkFrame@ Frame = cast<CGameManialinkFrame@>(Layer.LocalPage.GetFirstChild("frame-report-system"));
                if (Frame !is null && Frame.Visible)
                    return;
            }

            // if (Services::Settings.uiMedals.liveTotd
            //     && LiveTotd is null
            //     && pageName.StartsWith("Page_TOTDChannelDisplay")
            // ) {
            //     @LiveTotd = Layer.LocalPage;
            //     continue;
            // }

            if ((Services::Settings.uiMedals.seasonalCampaign || Services::Settings.uiMedals.clubCampaign)
                && Campaign is null
                && pageName.StartsWith("Page_CampaignDisplay")
            ) {
                @Campaign = Layer.LocalPage;
                continue;
            }

            if (Services::Settings.uiMedals.totd
                && Totd is null
                && pageName.StartsWith("Page_MonthlyCampaignDisplay")
            ) {
                @Totd = Layer.LocalPage;
                continue;
            }

            if (Services::Settings.uiMedals.training
                && Training is null
                && pageName.StartsWith("Page_TrainingDisplay")
            ) {
                @Training = Layer.LocalPage;
                continue;
            }

            if (Services::Settings.uiMedals.liveCampaign
                && LiveCampaign is null
                && pageName.StartsWith("Page_RoomCampaignDisplay")
            ) {
                @LiveCampaign = Layer.LocalPage;
                continue;
            }
        }

        RenderCampaignPage(Campaign);
        RenderLiveCampaignPage(LiveCampaign);
        // RenderLiveTotdPage(LiveTotd);
        RenderTotdPage(Totd);
        RenderTrainingPage(Training);
    }

    void RenderCampaign(CGameManialinkFrame@ Maps, const string &in campaignId, bool club = false) {
        if (Maps is null) return;
        if (campaignId.Length == 0) return;

        int8[] indicesToShow;
        auto campaign = Services::Maps.GetCampaign(campaignId);
        if (campaign !is null) {
            for (uint i = 0; i < campaign.maps.Length; i++) {
                Domain::Map@ map = cast<Domain::Map@>(campaign.maps.GetByIndex(i));
                if (map is null) continue;

                Domain::MedalTime@ medalTime = Services::CurrentPlayer.GetMedalTime(map.mapUid);
                Domain::PB@ pb = Services::PBs.GetPB(map.mapUid);
                if (pb is null) continue;
                if (!pb.HasMedalTime(medalTime)) continue;

                indicesToShow.InsertLast(map.index);
            }
        }

        for (uint i = 0; i < Maps.Controls.Length; i++) {
            if (indicesToShow.Length == 0)
                break;

            if (indicesToShow.Find(i) == -1)
                continue;

            CGameManialinkFrame@ Map = cast<CGameManialinkFrame@>(Maps.Controls[i]);
            if (Map is null) continue;
            if (!Map.Visible) continue;

            CGameManialinkFrame@ MedalStack = cast<CGameManialinkFrame@>(Map.GetFirstChild("frame-medal-stack"));
            if (MedalStack is null) continue;
            if(!MedalStack.Visible) continue;

            const float w = Math::Max(1, Draw::GetWidth());
            const float h = Math::Max(1, Draw::GetHeight());
            const vec2 center = vec2(w * 0.5f, h * 0.5f);
            const float unit = (w / h < stdRatio) ? w / 320.0f : h / 180.0f;
            const vec2 scale = vec2(unit, -unit);
            const vec2 offset = vec2(-99.8f, 1.05f) + (club ? vec2(0.4f, 2.51f) : vec2());
            const vec2 rowOffset = vec2(-2.02f, -11.5f) * (i % 5);
            const vec2 colOffset = vec2(36.0f, 0.0f) * (i / 5);
            const vec2 coords = center + scale * (offset + rowOffset + colOffset);

            nvg::BeginPath();
            nvg::FillPaint(nvg::TexturePattern(coords, vec2(unit * 9.6f), 0.0f, Services::Icons.GetIconUI(), 1.0f));
            nvg::Fill();
        }
    }

    void RenderCampaignPage(CGameManialinkPage@ Page) {
        if (Page is null) return;

        string campaignName;
        CGameManialinkLabel@ CampaignLabel = cast<CGameManialinkLabel@>(Page.GetFirstChild("label-title"));
        if (CampaignLabel !is null)
            campaignName = CampaignLabel.Value;

        string clubName;
        CGameManialinkFrame@ ClubLink = cast<CGameManialinkFrame@>(Page.GetFirstChild("button-club"));
        if (ClubLink !is null && ClubLink.Visible) {
            CGameManialinkLabel@ ClubLabel = cast<CGameManialinkLabel@>(ClubLink.GetFirstChild("menu-libs-expendable-button_label-button-text"));
            if (ClubLabel !is null)
                clubName = ClubLabel.Value.SubStr(15);
        }
        const bool club = clubName.Length > 0;

        if (club) {
            if (!Services::Settings.uiMedals.clubCampaign)
                return;
        } else {
            if (!Services::Settings.uiMedals.seasonalCampaign)
                return;
            campaignName = campaignName.SubStr(19).Replace("\u0091", " ");
        }

        RenderCampaign(cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-maps")), campaignName, club);
    }

    void RenderLiveCampaignPage(CGameManialinkPage@ Page) {
        if (Page is null) return;

        string campaignName;
        CGameManialinkLabel@ CampaignLabel = cast<CGameManialinkLabel@>(Page.GetFirstChild("label-title"));
        if (CampaignLabel !is null)
            campaignName = string(CampaignLabel.Value).SubStr(19).Replace("\u0091", " ");

        RenderCampaign(cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-maps")), campaignName, false);
    }

    // void RenderLiveTotdPage(CGameManialinkPage@ Page) {
    //     if (Page is null) return;

    //     CGameManialinkFrame@ PrevDay = cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-previous-day"));
    //     if (PrevDay is null || !PrevDay.Visible) return;

    //     CGameManialinkLabel@ DayLabel = cast<CGameManialinkLabel@>(PrevDay.GetFirstChild("label-day"));
    //     if (DayLabel is null) return;

    //     const string date = string(DayLabel.Value).SubStr(19).Replace("%1\u0091", "");
    //     UI::Text(date);

    //     // uint month = 0;

    //     const uint day = Text::ParseUInt(date.SubStr(date.Length - 2));
    //     UI::Text(tostring(day));

    //     CGameManialinkFrame@ MedalStack = cast<CGameManialinkFrame@>(PrevDay.GetFirstChild("frame-medal-stack"));
    //     if (MedalStack is null || !MedalStack.Visible) return;

    //     UI::Text("medal stack");
    // }

    void RenderPlaygroundPage(CGameManialinkPage@ Page, PlaygroundPageType type = PlaygroundPageType::Start, CGameManialinkPage@ ScoresTable = null) {
        if (Page is null) return;

        if (type == PlaygroundPageType::Pause) {
            CTrackMania@ App = cast<CTrackMania@>(GetApp());
            CTrackManiaNetwork@ Network = cast<CTrackManiaNetwork@>(App.Network);
            if (!Network.PlaygroundClientScriptAPI.IsInGameMenuDisplayed)
                return;

            if (ScoresTable !is null) {
                CGameManialinkFrame@ TableLayer = cast<CGameManialinkFrame@>(ScoresTable.GetFirstChild("frame-scorestable-layer"));
                if (TableLayer !is null && TableLayer.Visible)
                    return;
            }

            const string[] frames = {
                "frame-help",
                "frame-map-list",
                "frame-options",
                "frame-prestige",
                "frame-profile",
                "frame-report-system",
                "frame-server",
                "frame-settings",
                "frame-teams",
                "popupmultichoice-leave-match"
            };

            for (uint i = 0; i < frames.Length; i++) {
                CGameManialinkFrame@ Frame = cast<CGameManialinkFrame@>(Page.GetFirstChild(frames[i]));
                if (Frame !is null && Frame.Visible)
                    return;
            }

        } else {
            if (type == PlaygroundPageType::Start) {
                CGameManialinkFrame@ OpponentsList = cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-more-opponents-list"));
                if (OpponentsList !is null && OpponentsList.Visible)
                    return;
            }

            CGameManialinkFrame@ Global = cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-global"));
            if (Global is null || !Global.Visible)
                return;
        }

        const bool banner = type == PlaygroundPageType::Record;

        CGameManialinkControl@ Medal = Page.GetFirstChild(banner ? "quad-medal" : "ComponentMedalStack_frame-global");
        if (Medal is null
            || !Medal.Visible
            || (banner
                && (!Medal.Parent.Visible  // not visible in campaign mode, probably others
                || Medal.AbsolutePosition_V3.x < -170.0f  // off screen
            ))
        )
            return;

        const float w      = Math::Max(1, Draw::GetWidth());
        const float h      = Math::Max(1, Draw::GetHeight());
        const vec2  center = vec2(w * 0.5f, h * 0.5f);
        const float hUnit  = h / 180.0f;
        const vec2  scale  = vec2((w / h > stdRatio) ? hUnit : w / 320.0f, -hUnit);
        const vec2  size   = vec2(banner ? 21.9f : 19.584f) * hUnit;
        const vec2  offset = vec2(banner ? -size.x * 0.5f : 0.0f, -size.y * 0.5f);
        const vec2  coords = center + offset + scale * (Medal.AbsolutePosition_V3 + vec2(banner ? 0.0f : 12.16f, 0.0f));

        const bool end = type == PlaygroundPageType::End;

        CGameManialinkFrame@ MenuContent;
        if (end)
            @MenuContent = cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-menu-content"));

        if (!end
            || (MenuContent !is null && MenuContent.Visible)
        ) {
            nvg::BeginPath();
            nvg::FillPaint(nvg::TexturePattern(coords, size, 0.0f, Services::Icons.GetIconUI(), 1.0f));
            nvg::Fill();
        }

        CGameManialinkFrame@ NewMedal = cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-new-medal"));
        if (NewMedal is null || !NewMedal.Visible)
            return;

        CGameManialinkQuad@ QuadMedal = cast<CGameManialinkQuad@>(NewMedal.GetFirstChild("quad-medal-anim"));
        if (QuadMedal is null
            || !QuadMedal.Visible
            || QuadMedal.AbsolutePosition_V3.x > -85.0f  // end race menu still hidden
        )
            return;

        const vec2 quadMedalOffset = vec2(-size.x, -size.y) * 1.15f;
        const vec2 quadMedalCoords = center + quadMedalOffset + scale * QuadMedal.AbsolutePosition_V3;
        const vec2 quadMedalSize   = vec2(45.0f * hUnit);

        nvg::BeginPath();
        nvg::FillPaint(nvg::TexturePattern(quadMedalCoords, quadMedalSize, 0.0f, Services::Icons.GetIconUI(), 1.0f));
        nvg::Fill();
    }

    void RenderTotdPage(CGameManialinkPage@ Page) {
        if (Page is null) return;

        CGameManialinkFrame@ Maps = cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-maps"));
        if (Maps is null) return;

        string monthName;
        CGameManialinkLabel@ MonthLabel = cast<CGameManialinkLabel@>(Page.GetFirstChild("label-title"));
        if (MonthLabel !is null)
            monthName = string(MonthLabel.Value).SubStr(12).Replace("%1\u0091", "");

        int8[] indicesToShow;
        auto campaign = Services::Maps.GetCampaign(monthName);
        if (campaign !is null) {
            for (uint i = 0; i < campaign.maps.Length; i++) {
                Domain::Map@ map = cast<Domain::Map@>(campaign.maps.GetByIndex(i));
                if (map is null) continue;

                Domain::MedalTime@ medalTime = Services::CurrentPlayer.GetMedalTime(map.mapUid);
                Domain::PB@ pb = Services::PBs.GetPB(map.mapUid);
                if (pb is null) continue;
                if (!pb.HasMedalTime(medalTime)) continue;

                indicesToShow.InsertLast(map.index);
            }
        }

        uint indexOffset = 0;
        for (uint i = 0; i < Maps.Controls.Length; i++) {
            if (indexOffset > 6) break;
            if (indicesToShow.Length == 0) break;

            CGameManialinkFrame@ Map = cast<CGameManialinkFrame@>(Maps.Controls[i]);
            if (Map is null || !Map.Visible) {
                indexOffset++;
                continue;
            }

            if (indicesToShow.Find(i - indexOffset) == -1)
                continue;

            CGameManialinkFrame@ MedalStack = cast<CGameManialinkFrame@>(Map.GetFirstChild("frame-medalstack"));
            if (MedalStack is null) continue;
            if (!MedalStack.Visible) continue;

            const float w = Math::Max(1, Draw::GetWidth());
            const float h = Math::Max(1, Draw::GetHeight());
            const vec2 center = vec2(w * 0.5f, h * 0.5f);
            const float unit = (w / h < stdRatio) ? w / 320.0f : h / 180.0f;
            const vec2 scale = vec2(unit, -unit);
            const vec2 offset = vec2(-118.2f, 1.2f);
            const vec2 colOffset = vec2(29.1f, 0.0f) * (i % 7);
            const vec2 rowOffset = vec2(-2.02f, -11.5f) * (i / 7);
            const vec2 coords = center + scale * (offset + colOffset + rowOffset);

            nvg::BeginPath();
            nvg::FillPaint(nvg::TexturePattern(coords, vec2(unit * 9.15f), 0.0f, Services::Icons.GetIconUI(), 1.0f));
            nvg::Fill();
        }
    }

    void RenderTrainingPage(CGameManialinkPage@ Page) {
        if (Page is null) return;
        RenderCampaign(cast<CGameManialinkFrame@>(Page.GetFirstChild("frame-maps")), "training", true);
    }
}