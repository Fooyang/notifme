from playwright.sync_api import Page

def find_element_by_xpath(page: Page, xpath: str):
    try:
        element = page.wait_for_selector(xpath, timeout = 5000)
        return element
    except Exception as e:
        print(f"Element not found: {e}")
        return None

# Example usage:
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    
    page.goto('https://public.enroll.wisc.edu/search?keywords=Math%20240')
    # page.get_by_role("button", name="MATH 240 3.00 credits Introduction to Discrete Mathematics").click()
    # page.get_by_role("button", name="See sections").click()
    page.get_by_text("MATH 240 3.00 credits Introduction to Discrete Mathematics").click()
    page.get_by_text("See sections").click()
    page.get_by_text("DIS 315").click()


    element = find_element_by_xpath(page,'//*[@id="sections"]/section/section/cse-course-packages/cse-detail-topic/section/cse-package-group[1]/details/details[3]/cse-section-details/div[1]/div[1]/cse-detail-topic[1]/section/ul/li[2]')

    if element:
        print(element.inner_text())
        
    #     def run(playwright: Playwright) -> None:
    #     browser = playwright.chromium.launch(headless=False)
    # context = browser.new_context()
    # page = context.new_page()
    # page.goto("https://public.enroll.wisc.edu/search")


    # ---------------------
    # context.close()
    # browser.close()

    browser.close()
