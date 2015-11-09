describe('OmniRose Watch Timer', function() {

  it('should have a title', function() {
    browser.get('/');
    expect(browser.getTitle()).toEqual('OmniRose Watch Timer');
  });

  it('should go to "/timer" by default', function() {
    browser.get('/');
    expect(browser.getCurrentUrl()).toMatch('/timer$');
  });


});

describe("Alarm silence button", function() {

  function test_alarm_silence_button() {
    browser.executeScript(function() {
      sinonClock = sinon.useFakeTimers();
    });

    expect(browser.getCurrentUrl()).toMatch('/timer$');

    element(by.className("ion-play")).click()

    browser.executeScript(function() {
      sinonClock.tick(60 * 60 * 1000);
    });
    browser.sleep(2000);


    // on alarm page. Silence the alarm and leave
    expect(browser.getCurrentUrl()).toMatch('/alarm$');
    expect(element(by.buttonText("Silence Alarm")).isDisplayed()).toBe(true);
    element(by.buttonText("Silence Alarm")).click();
    element(by.className("ion-close")).click();

    // back on timer page.
    expect(browser.getCurrentUrl()).toMatch('/timer$');
    element(by.className("ion-play")).click()
    browser.executeScript(function() {
      sinonClock.tick(60 * 60 * 1000);
    });
    browser.sleep(2000);

    // on alarm page. check that the silence alarm button is visible
    expect(browser.getCurrentUrl()).toMatch('/alarm$');
    expect(element(by.buttonText("Silence Alarm")).isDisplayed()).toBe(true);
  }

  it('should stay silenced from timer page', function() {
    test_alarm_silence_button();
  });

});
