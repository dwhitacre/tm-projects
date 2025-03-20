[Setting category="Window" name="Hide when the game interface is hidden"]
bool S_Window_HideWithIFace = false;

[Setting category="Window" name="Hide when the Openplanet overlay is hidden"]
bool S_Window_HideWithOverlay = false;

[Setting category="Window" name="Hide when a bounty map is not being played" description="Not compatible with TTA mode"]
bool S_Window_HideWhenNotInBountyMap = false;

[Setting category="Window" name="Is In Bounty Map" hidden]
bool S_Window_IsInBountyMap = false;

[Setting category="Window" name="Window visiblility hotkey"]
VirtualKey S_Window_VisibleKey = VirtualKey(0);

[Setting category="Window" name="Lock window position" description="Prevents the window moving when click and drag or when the game window changes size."]
bool S_Window_LockPosition = false;

[Setting category="Window" name="Window visible" description="To adjust the position of the window, click and drag while the Openplanet overlay is visible."]
bool S_Window_Visible = true;

[Setting category="Window" name="Window position"]
vec2 S_Window_Anchor = vec2(0, 170);