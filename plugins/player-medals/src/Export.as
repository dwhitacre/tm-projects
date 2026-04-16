namespace PlayerMedals {
    /*
     * Returns whether the configured current player has a medal time for the given map.
     */
    import bool HasCurrentPlayerMedalTime(const string &in mapUid) from "PlayerMedals";

    /*
     * Returns the effective medal time for the configured current player on the given map.
     * This prefers any custom override time and falls back to the base medal time.
     * Returns -1 when no medal time exists.
     */
    import int64 GetCurrentPlayerMedalTime(const string &in mapUid) from "PlayerMedals";

    /*
     * Returns all exported player medals for a map as a JSON array string.
     *
     * Each item currently contains:
     * - mapUid
     * - accountId
     * - medalTime
     * - customMedalTime
     * - time
     * - reason
     *
     * The array currently contains zero or one item for the configured current player,
     * but uses an array shape so the boundary stays extensible.
     */
    import string GetMapMedalTimesJson(const string &in mapUid) from "PlayerMedals";
}
