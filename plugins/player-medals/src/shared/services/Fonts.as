namespace Services {
    class FontsService : Service {
        UI::Font@ header;
        UI::Font@ subHeader;

        FontsService() {
            super();
        }

        UI::Font@ GetHeader() {
            if (header !is null) return header;

            @header = UI::LoadFont("DroidSans.ttf", 26);
            return header;
        }

        UI::Font@ GetSubHeader() {
            if (subHeader !is null) return subHeader;

            @subHeader = UI::LoadFont("DroidSans.ttf", 20);
            return subHeader;
        }

        void Clear() {
            @header = null;
            @subHeader = null;
        }
    }
}
