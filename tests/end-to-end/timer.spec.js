describe('OmniRose Watch Timer', function() {

  it('should have a title', function() {
    browser.get('/');
    expect(browser.getTitle()).toEqual('OmniRose Watch Timer');
  });

});
