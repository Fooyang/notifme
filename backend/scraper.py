from playwright.sync_api import Page
from playwright.sync_api import sync_playwright

def find_element_by_xpath(page: Page, xpath: str):
    try:
        element = page.wait_for_selector(xpath)
        return element
    except Exception as e:
        print(f"Element not found: {e}")
        return None

def navigate_to_element(url, clicks, xpath):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # BANG!
        page.goto(url)
        
        for click in clicks:
            page.wait_for_selector(click)
            button_element = page.query_selector(click)
            button_element.click()
        element = find_element_by_xpath(page, xpath)
        if element:
            print(element.inner_text())
            return element.inner_text()

        browser.close()
    return ""


