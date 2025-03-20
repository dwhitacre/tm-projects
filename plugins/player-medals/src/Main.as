void Main() {
    startnew(Services::StartReadyHealthCheck);
    startnew(Services::LoadServices);
    startnew(Services::StartPBLoop);
    // TODO: active map loop?
}

void Render() {
    View::Main.Render();
    View::Medal.Render();
}

void RenderEarly() {
    View::RenderUIMedals();
}

void RenderMenu() {
    View::Menu.Render();
}
