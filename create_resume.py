from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUTPUT = r"C:\Users\jmcha\Documents\BYUI\WDD 430\wdd 430\jemscreations\JennaMcHargue_Marketing_Resume.docx"

doc = Document()
section = doc.sections[0]
section.top_margin = Inches(0.45)
section.bottom_margin = Inches(0.45)
section.left_margin = Inches(0.62)
section.right_margin = Inches(0.62)
section.page_width = Inches(8.5)
section.page_height = Inches(11)

styles = doc.styles
normal = styles['Normal']
normal.font.name = 'Arial'
normal.font.size = Pt(9.6)
normal.font.color.rgb = RGBColor(0, 0, 0)
normal.paragraph_format.space_after = Pt(0)
normal.paragraph_format.line_spacing = 1.0

title_style = styles['Title']
title_style.font.name = 'Arial'
title_style.font.size = Pt(22)
title_style.font.bold = True
title_style.font.color.rgb = RGBColor(0, 0, 0)
title_style.paragraph_format.space_after = Pt(1)

def set_keep(paragraph, keep_next=False):
    pPr = paragraph._p.get_or_add_pPr()
    if keep_next:
        el = OxmlElement('w:keepNext')
        pPr.append(el)

def add_rule(paragraph, color='B7B7B7', size='6'):
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), size)
    bottom.set(qn('w:space'), '1')
    bottom.set(qn('w:color'), color)
    pBdr.append(bottom)
    pPr.append(pBdr)

def add_section_heading(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text.upper())
    r.bold = True
    r.font.name = 'Arial'
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(31, 78, 121)
    set_keep(p, True)
    return p

def add_bullet(text, level=0):
    p = doc.add_paragraph(style='Normal')
    p.paragraph_format.left_indent = Inches(0.18 + level * 0.18)
    p.paragraph_format.first_line_indent = Inches(-0.12)
    p.paragraph_format.space_after = Pt(0.5)
    p.paragraph_format.line_spacing = 1.0
    p.add_run('• ').font.size = Pt(9.6)
    p.add_run(text)
    return p

def add_role(role, organization, dates, location):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.tab_stops.add_tab_stop(Inches(7.1), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.SPACES)
    r = p.add_run(role)
    r.bold = True
    r.font.name = 'Arial'
    r.font.size = Pt(10)
    p.add_run('\t' + dates).font.size = Pt(9.4)
    set_keep(p, True)
    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(1)
    p2.paragraph_format.tab_stops.add_tab_stop(Inches(7.1), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.SPACES)
    r2 = p2.add_run(organization)
    r2.italic = True
    r2.font.name = 'Arial'
    r2.font.size = Pt(9.4)
    p2.add_run('\t' + location).font.size = Pt(9.4)
    return p, p2

# Header
p = doc.add_paragraph(style='Title')
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run('Jenna McHargue')
p2 = doc.add_paragraph()
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
p2.paragraph_format.space_after = Pt(5)
r = p2.add_run('jmchargue54@gmail.com | (509) 770-3838 | www.linkedin.com/in/jenna-mchargue')
r.font.name = 'Arial'
r.font.size = Pt(9.6)
add_rule(p2, color='7F7F7F', size='6')

add_section_heading('Professional Summary')
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(1)
p.add_run('Marketing-minded web design student with experience creating social media content, supporting audience engagement, conducting UX research, and building e-commerce websites. Skilled in Canva, Figma, WordPress, WooCommerce, content creation, and customer-focused digital experiences.')

add_section_heading('Education')
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(0)
p.paragraph_format.tab_stops.add_tab_stop(Inches(7.1), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.SPACES)
r = p.add_run("Bachelor's Degree in Web Design and Development")
r.bold = True
r.font.size = Pt(10)
p.add_run('\tExpected April 2027').font.size = Pt(9.4)
p2 = doc.add_paragraph()
p2.paragraph_format.space_after = Pt(0)
p2.paragraph_format.tab_stops.add_tab_stop(Inches(7.1), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.SPACES)
r = p2.add_run('Brigham Young University-Idaho')
r.italic = True
r.font.size = Pt(9.4)
p2.add_run('\tRexburg, ID').font.size = Pt(9.4)
add_bullet('Certificate in Graphic Design')
add_bullet('Relevant coursework: Integrated Digital Marketing, UX Research, Full-Stack Development')

add_section_heading('Work Experience')
add_role('Dental Assistant, Hygiene Assistant and Social Media Support', 'Division Street Dental', 'May 2023 - September 2026', 'Moses Lake, WA')
add_bullet('Managed daily schedules for 10-20 patients while coordinating appointments, consultations, x-rays, polishing, sterilization, and Dentrix updates')
add_bullet('Launched and maintained the practice\'s Instagram presence while continuing to support its Facebook page')
add_bullet('Created biweekly Reels, giveaways, and educational content to increase patient engagement and promote practice services')
add_bullet('Translated dental services into accessible, audience-focused content for current and prospective patients')
add_role('Web Design and Development Intern', 'Reentry Readiness Institute', 'April 2026 - August 2026', 'Remote')
add_bullet('Developed a WordPress/WooCommerce website with payment processing, shipping, e-commerce, and accessibility features')
add_bullet('Configured WordPress, WooCommerce, SiteGround, Kadence, Complianz, and related plugins to support a functional customer experience')
add_bullet('Organized website content and user flows around accessibility and ease of use')

add_section_heading('Selected Projects')
def add_project(name, bullets):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(name)
    r.bold = True
    r.font.size = Pt(10)
    set_keep(p, True)
    for b in bullets:
        add_bullet(b)

add_project('Jems Creations - E-Commerce Brand Project', [
    'Developed a full-stack jewelry e-commerce application with user authentication, shopping-cart functionality, and dynamic inventory management',
    'Combined product presentation, customer experience, and responsive web design to support an online retail brand',
    'Used PostgreSQL, JavaScript, EJS, and CSS'
])
add_project('Page Mate - Search and Content Experience', [
    'Partnered with a classmate to create a website where users could browse, search, filter, and read books online',
    'Applied user-focused information organization and built the interface with HTML, CSS, JavaScript, Netlify, and a book API'
])
add_project('Breed and Show Pro - UX Research Project', [
    'Collaborated with a five-person team to design an eight-page application in Figma',
    'Conducted more than 10 UX interviews and used customer feedback to guide design improvements'
])

add_section_heading('Skills')
skills = [
    ('Marketing and Content', 'Social media content, Instagram, Facebook, educational content, giveaway promotion, audience-focused messaging'),
    ('Design and Research', 'Canva, Figma, UX research, user interviews, graphic design'),
    ('Web and E-Commerce', 'WordPress, WooCommerce, HTML, CSS, JavaScript, SCSS, accessibility, e-commerce setup'),
    ('Technical', 'PostgreSQL, MySQL, MongoDB, Netlify, Render'),
]
for label, value in skills:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(label + ': ')
    r.bold = True
    p.add_run(value)

doc.core_properties.title = 'Jenna McHargue Marketing Resume'
doc.core_properties.subject = 'Marketing-focused resume'
doc.core_properties.author = 'Jenna McHargue'
doc.save(OUTPUT)
print(OUTPUT)
