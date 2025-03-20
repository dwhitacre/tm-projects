namespace Services {
    class IconsService : Service {
        UI::Texture@ icon32;
        UI::Texture@ icon512;
        nvg::Texture@ iconUI;

        IconsService() {
            super();
        }

        UI::Texture@ GetIcon32() {
            if (icon32 !is null) return icon32;

            @icon32 = UI::LoadTexture("src/assets/players/" + CurrentPlayer.accountId + "_32.png");
            if (icon32 is null) @icon32 = UI::LoadTexture("src/assets/default_32.png");
            return icon32;
        }

        UI::Texture@ GetIcon512() {
            if (icon512 !is null) return icon512;

            @icon512 = UI::LoadTexture("src/assets/players/" + CurrentPlayer.accountId + "_512.png");            
            if (icon512 is null) @icon512 = UI::LoadTexture("src/assets/default_512.png");
            return icon512;
        }

        nvg::Texture@ GetIconUI() {
            if (iconUI !is null) return iconUI;

            @iconUI = nvg::LoadTexture("src/assets/players/" + CurrentPlayer.accountId + "_512.png");
            if (iconUI is null) @iconUI = nvg::LoadTexture("src/assets/default_512.png");
            return iconUI;
        }

        void Clear() {
            @icon32 = null;
            @icon512 = null;
            @iconUI = null;
        }
    }
}
