namespace State {
    string PluginDisplayIcon = "\\$db4" + Icons::Trophy + "\\$z";
    string PluginDisplayName = PluginDisplayIcon + " " + Meta::ExecutingPlugin().Name;
    string PluginDisplayVersion = "\\$db4 v" + Meta::ExecutingPlugin().Version + "\\$z";
    string PluginDisplayNameAndVersion = PluginDisplayName + " " + PluginDisplayVersion;
}