[Setting hidden] bool S_UIMedals                 = true;
[Setting hidden] bool S_UIMedalBanner            = true;
[Setting hidden] bool S_UIMedalEnd               = true;
[Setting hidden] bool S_UIMedalPause             = true;
[Setting hidden] bool S_UIMedalsClubCampaign     = false;
[Setting hidden] bool S_UIMedalsLiveCampaign     = true;
[Setting hidden] bool S_UIMedalsLiveTotd         = false;
[Setting hidden] bool S_UIMedalsSeasonalCampaign = true;
[Setting hidden] bool S_UIMedalStart             = true;
[Setting hidden] bool S_UIMedalsTotd             = true;
[Setting hidden] bool S_UIMedalsTraining         = true;

namespace Domain {
    class UIMedals {
        bool get_enabled() {
            return S_UIMedals;
        }
        void set_enabled(bool enabled) {
            S_UIMedals = enabled;
        }

        bool get_banner() {
            return S_UIMedalBanner;
        }
        void set_banner(bool banner) {
            S_UIMedalBanner = banner;
        }

        bool get_end() {
            return S_UIMedalEnd;
        }
        void set_end(bool end) {
            S_UIMedalEnd = end;
        }

        bool get_pause() {
            return S_UIMedalPause;
        }
        void set_pause(bool pause) {
            S_UIMedalPause = pause;
        }

        bool get_clubCampaign() {
            return S_UIMedalsClubCampaign;
        }
        void set_clubCampaign(bool clubCampaign) {
            S_UIMedalsClubCampaign = clubCampaign;
        }

        bool get_liveCampaign() {
            return S_UIMedalsLiveCampaign;
        }
        void set_liveCampaign(bool liveCampaign) {
            S_UIMedalsLiveCampaign = liveCampaign;
        }

        bool get_liveTotd() {
            return S_UIMedalsLiveTotd;
        }
        void set_liveTotd(bool liveTotd) {
            S_UIMedalsLiveTotd = liveTotd;
        }

        bool get_seasonalCampaign() {
            return S_UIMedalsSeasonalCampaign;
        }
        void set_seasonalCampaign(bool seasonalCampaign) {
            S_UIMedalsSeasonalCampaign = seasonalCampaign;
        }

        bool get_start() {
            return S_UIMedalStart;
        }
        void set_start(bool start) {
            S_UIMedalStart = start;
        }

        bool get_totd() {
            return S_UIMedalsTotd;
        }
        void set_totd(bool totd) {
            S_UIMedalsTotd = totd;
        }

        bool get_training() {
            return S_UIMedalsTraining;
        }
        void set_training(bool training) {
            S_UIMedalsTraining = training;
        }

        UIMedals() {}

        bool IsEnabled() {
            return this.enabled && (this.banner || this.end || this.pause || this.clubCampaign || this.liveCampaign || this.liveTotd || this.seasonalCampaign || this.start || this.totd || this.training);
        }

        void Reset() {
            this.enabled = true;
            this.banner = true;
            this.end = true;
            this.pause = true;
            this.clubCampaign = false;
            this.liveCampaign = true;
            this.liveTotd = false;
            this.seasonalCampaign = true;
            this.start = true;
            this.totd = true;
            this.training = true;
        }
    }
}