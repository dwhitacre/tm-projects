namespace Domain {
    enum CampaignType {
        Seasonal,
        TrackOfTheDay,
        Other,
        Unknown
    }

    class Campaign : Domain {
        string name = "";
        CampaignType type = CampaignType::Unknown;
        uint index = uint(-1);
        uint colorIndex = uint(-1);
        uint month = uint(-1);
        uint year = uint(-1);
        Cache@ maps = Cache();

        Campaign() {
            super();
        }

        Json::Value@ ToJson() override {
            auto json = Json::Object();
            json["name"] = this.name;
            json["type"] = this.type;   
            json["index"] = this.index;
            json["colorIndex"] = this.colorIndex;
            json["month"] = this.month;
            json["year"] = this.year;
            json["mapsCount"] = this.maps.Length;
            return json;
        }

        array<string>@ Columns() override {
            return {
                "name",
                "type",
                "index",
                "colorIndex",
                "month",
                "year",
                "mapsCount"
            };
        }

        int CompareTo(Domain@ other) override {
            auto otherCampaign = cast<Campaign@>(other);
            if (otherCampaign is null) return 0;

            if (this.index < otherCampaign.index) return -1;
            if (this.index > otherCampaign.index) return 1;
            return 0;
        }

        Domain@ Copy() override {
            auto campaign = Campaign();
            campaign.name = this.name;
            campaign.type = this.type;
            campaign.index = this.index;
            campaign.colorIndex = this.colorIndex;
            campaign.month = this.month;
            campaign.year = this.year;
            campaign.maps = this.maps;
            return campaign;
        }
    }

    Campaign@ CampaignFromMap(Map@ map) {
        if (map.totdDate.Length > 0) return CampaignTrackOfTheDayFromMap(map);
        if (map.nadeo) return CampaignSeasonalFromMap(map);
        return CampaignUnknownFromMap(map);
    }

    Campaign@ CampaignSeasonalFromMap(Map@ map) {
        if (map.campaign.Length > 0) return CampaignOtherFromMap(map);

        auto campaign = Campaign();
        campaign.name = map.name.SubStr(0, map.name.Length - 5);
        campaign.type = CampaignType::Seasonal;

        auto year = Text::ParseUInt(campaign.name.SubStr(campaign.name.Length - 4)) - 2020;
        campaign.year = year;
        if (campaign.name.StartsWith("Summer")) {
            campaign.index = 4 * year;
            campaign.colorIndex = 2;
        }
        else if (campaign.name.StartsWith("Fall")) {
            campaign.index = 1 + 4 * year;
            campaign.colorIndex = 3;
        }
        else if (campaign.name.StartsWith("Winter")) {
            campaign.index = 2 + 4 * (year - 1);
            campaign.colorIndex = 0;
        }
        else {
            campaign.index = 3 + 4 * (year - 1);
            campaign.colorIndex = 1;
        }
        return campaign;
    }

    Campaign@ CampaignTrackOfTheDayFromMap(Map@ map) {
        auto campaign = Campaign();

        campaign.name = Domain::MonthFromInt(Text::ParseUInt(map.totdDate.SubStr(5, 2))) + " " + map.totdDate.SubStr(0, 4);
        campaign.type = CampaignType::TrackOfTheDay;

        auto year = Text::ParseUInt(map.totdDate.SubStr(0, 4)) - 2020;
        auto month = Text::ParseUInt(map.totdDate.SubStr(5, 2));
        
        campaign.year = year;
        campaign.month = month;
        campaign.index = ((month + 5) % 12) + 12 * (year - (month < 7 ? 1 : 0));

        switch (month) {
            case 1: case 2: case 3:
                campaign.colorIndex = 0;
                break;
            case 4: case 5: case 6:
                campaign.colorIndex = 1;
                break;
            case 7: case 8: case 9:
                campaign.colorIndex = 2;
                break;
            default:
                campaign.colorIndex = 3;
        }

        return campaign;
    }

    Campaign@ CampaignOtherFromMap(Map@ map) {
        auto campaign = Campaign();

        campaign.name = Text::StripFormatCodes(map.campaign);
        campaign.type = CampaignType::Other;
        campaign.index = uint(campaign.name[0]) - 1;

        return campaign;
    }

    Campaign@ CampaignUnknownFromMap(Map@ map) {
        auto campaign = Campaign();

        campaign.name = Text::StripFormatCodes(map.name.Trim().SubStr(0, 1).ToUpper());
        campaign.type = CampaignType::Unknown;
        campaign.index = uint(campaign.name[0]) - 1;

        return campaign;
    }
}