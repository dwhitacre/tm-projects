namespace Interface {
    void RenderStyledText(const string &in name, vec3 style = vec3(1, 1, 1)) {
        UI::Text(Text::FormatOpenplanetColor(style) + name);
    }

    void RenderTime(int time, vec3 style) {
        RenderStyledText((time > 0 ? Time::Format(time) : "-:--.---"), style);
    }

    void RenderAvgTime(int time, vec3 style) {
        RenderStyledText("(" + (time > 0 ? Time::Format(time) : "-:--.---") + ")", style);
    }

    vec3 Rainbow(vec3 rainbow, float increment = S_Campaign_GroupHighlightRainbowInterval) {
        if (rainbow.x >= 1.f && rainbow.y < 1.f && rainbow.z <= 0.f) return vec3(1.f, incrementRainbow(rainbow.y, increment), 0.f);
        else if (rainbow.x > 0.f && rainbow.y >= 1.f && rainbow.z <= 0.f) return vec3(decrementRainbow(rainbow.x, increment), 1.f, 0.f);
        else if (rainbow.x <= 0.f && rainbow.y >= 1.f && rainbow.z < 1.f) return vec3(0.f, 1.f, incrementRainbow(rainbow.z, increment));
        else if (rainbow.x <= 0.f && rainbow.y > 0.f && rainbow.z >= 1.f) return vec3(0.f, decrementRainbow(rainbow.y, increment), 1.f);
        else if (rainbow.x < 1.f && rainbow.y <= 0.f && rainbow.z >= 1.f) return vec3(incrementRainbow(rainbow.x, increment), 0.f, 1.f);
        else if (rainbow.x >= 1.f && rainbow.y <= 0.f && rainbow.z > 0.f) return vec3(1.f, 0.f, decrementRainbow(rainbow.z, increment));
        else return vec3(1.f, 0.f, 0.f);
    }

    float incrementRainbow(float value, float increment) {
        return value + increment;
    }

    float decrementRainbow(float value, float increment) {
        return value - increment;
    }
}