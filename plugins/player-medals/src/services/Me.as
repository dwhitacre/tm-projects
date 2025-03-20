namespace Services {
    class MeService : Service {
        Domain::Player@ me;
        Clients::MeClient@ client;

        MeService() {
            super();
            @client = Clients::MeClient(Settings.options);
        }

        Domain::Player@ Get() {
            return me;
        }

        bool HasViewPermissionOnly() {
            if (me is null) return true;
            if (me.permissions.Length < 1) return true;
            if (me.permissions.Length > 1) return false;
            return me.permissions[0] == Domain::Permission::View;
        }

        bool HasPermission(const string&in permission) {
            if (me is null) return false;
            if (me.HasPermission(Domain::Permission::Admin)) return true;
            return me.HasPermission(permission);
        }

        void Fetch() {
            auto meResponse = client.Fetch();
            if (meResponse is null) return;

            @me = meResponse;
        }

        bool get_hasPlayPermission() {
            return Permissions::PlayLocalMap(); 
        }

        void Clear() {
            @me = null;
        }
    }
}
