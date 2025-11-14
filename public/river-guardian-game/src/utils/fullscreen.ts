export const requestFullscreen = () => {
  const element = document.documentElement;

  if (
    !document.fullscreenElement &&
    // @ts-ignore: Vendor-specific properties
    !document.mozFullScreenElement &&
    // @ts-ignore: Vendor-specific properties
    !document.webkitFullscreenElement &&
    // @ts-ignore: Vendor-specific properties
    !document.msFullscreenElement
  ) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    // @ts-ignore: Vendor-specific properties
    } else if (element.mozRequestFullScreen) { // Firefox
      // @ts-ignore: Vendor-specific properties
      element.mozRequestFullScreen();
    // @ts-ignore: Vendor-specific properties
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      // @ts-ignore: Vendor-specific properties
      element.webkitRequestFullscreen();
    // @ts-ignore: Vendor-specific properties
    } else if (element.msRequestFullscreen) { // IE/Edge
      // @ts-ignore: Vendor-specific properties
      element.msRequestFullscreen();
    }
  }
};
