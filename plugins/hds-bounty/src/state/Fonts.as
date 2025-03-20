namespace State {
    UI::Font@ MonoFont;
    UI::Font@ BoldFont;
    UI::Font@ BigFont;
    UI::Font@ MidFont;

    void LoadFonts() {
        @BoldFont = UI::LoadFont("DroidSans-Bold.ttf");
        @MonoFont = UI::LoadFont("DroidSansMono.ttf");
        @BigFont = UI::LoadFont("DroidSans.ttf", 26);
        @MidFont = UI::LoadFont("DroidSans.ttf", 20);
    }
}