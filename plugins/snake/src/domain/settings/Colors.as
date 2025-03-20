[Setting hidden] vec3 S_ColorFall = vec3(1.0f, 0.5f, 0.0f);
[Setting hidden] vec3 S_ColorSpring = vec3(0.3f, 0.9f, 0.3f);
[Setting hidden] vec3 S_ColorSummer = vec3(1.0f, 0.8f, 0.0f);
[Setting hidden] vec3 S_ColorWinter = vec3(0.0f, 0.8f, 1.0f);

namespace Domain {
    class Colors {
        vec3 get_fall() {
            return S_ColorFall;
        }
        void set_fall(const vec3&in fall) {
            S_ColorFall = fall;
        }

        vec3 get_spring() {
            return S_ColorSpring;
        }
        void set_spring(const vec3&in spring) {
            S_ColorSpring = spring;
        }

        vec3 get_summer() {
            return S_ColorSummer;
        }
        void set_summer(const vec3&in summer) {
            S_ColorSummer = summer;
        }

        vec3 get_winter() {
            return S_ColorWinter;
        }
        void set_winter(const vec3&in winter) {
            S_ColorWinter = winter;
        }

        array<vec3>@ get_seasons() {
            return {
                this.winter,
                this.spring,
                this.summer,
                this.fall
            };
        }

        Colors() {}

        void Reset() {
            this.fall = vec3(1.0f, 0.5f, 0.0f);
            this.spring = vec3(0.3f, 0.9f, 0.3f);
            this.summer = vec3(1.0f, 0.8f, 0.0f);
            this.winter = vec3(0.0f, 0.8f, 1.0f);
        }
    }
}