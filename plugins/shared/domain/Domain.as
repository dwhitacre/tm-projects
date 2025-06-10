namespace Domain {
    abstract class Domain {
        int CompareTo(Domain@ other) {
            return 0;
        }

        array<string>@ Columns() {
            return {};
        }

        Json::Value@ ToJson() {
            return Json::Object();
        }

        Domain@ Copy() {
            return null;
        }
    }
}