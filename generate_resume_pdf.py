import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def create_resume(filename="satwick-shaw-resume.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#111111'),
        alignment=TA_CENTER
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#b15f2c'),
        alignment=TA_CENTER
    )

    contact_style = ParagraphStyle(
        'ContactText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#444444'),
        alignment=TA_CENTER
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#111111'),
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#222222')
    )

    bold_body = ParagraphStyle(
        'BoldBody',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#111111')
    )

    story = []

    # Header
    story.append(Paragraph("SATWICK SHAW", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("DATA SCIENCE &amp; AI ENGINEER | FULL-STACK DEVELOPER", subtitle_style))
    story.append(Spacer(1, 4))

    contact_line = "India &nbsp;|&nbsp; GitHub: github.com/satwick-yes &nbsp;|&nbsp; LinkedIn: linkedin.com/in/satwick-shaw-a5b142371 &nbsp;|&nbsp; Kaggle: kaggle.com"
    story.append(Paragraph(contact_line, contact_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#b15f2c'), spaceAfter=10))

    # Executive Summary
    story.append(Paragraph("SUMMARY", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=6))
    summary_text = "Data Science undergraduate at <b>IIT Madras</b> and Chemical Engineering student with expertise in Machine Learning, AI Architecture, and Full-Stack Engineering. Creator of 140+ software repositories, 1 Technological Patent applicant, and author of 1 Published Research Paper. Specialized in building intelligent two-stage LLM classifiers, reactive web applications, and high-performance algorithms."
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 10))

    # Education
    story.append(Paragraph("EDUCATION", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=6))
    
    edu_data = [
        [
            Paragraph("<b>Indian Institute of Technology Madras (IIT Madras)</b><br/><i>Bachelor of Science (B.S.) in Data Science &amp; Applications</i>", body_style),
            Paragraph("<b>2022 &ndash; Present</b><br/>Chennai, India", ParagraphStyle('RText', parent=body_style, alignment=TA_RIGHT))
        ],
        [
            Paragraph("Coursework: Machine Learning, Statistical Modeling, Data Structures &amp; Algorithms, Deep Learning, Database Systems.", ParagraphStyle('SubEdu', parent=body_style, fontSize=8.5, leading=11, textColor=colors.HexColor('#555555'))),
            Paragraph("", body_style)
        ],
        [
            Paragraph("<b>Chemical Engineering Degree</b><br/><i>Bachelor of Technology (B.Tech) / Engineering Studies</i>", body_style),
            Paragraph("<b>2022 &ndash; Present</b>", ParagraphStyle('RText2', parent=body_style, alignment=TA_RIGHT))
        ]
    ]

    t_edu = Table(edu_data, colWidths=[380, 160])
    t_edu.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_edu)
    story.append(Spacer(1, 10))

    # Accomplishments & Milestones
    story.append(Paragraph("KEY MILESTONES &amp; CREDENTIALS", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=6))
    
    milestones = [
        "<b>1 Technological Patent Filed:</b> Invented and submitted an official technological patent for an engineering system and computational methodology.",
        "<b>1 Published Academic Research Paper:</b> Authored and published research detailing algorithmic optimizations and data structures.",
        "<b>140+ Software Repositories Shipped:</b> Engineered full-stack web applications, AI classifiers, computer vision modules, and visual canvas tools available on GitHub."
    ]
    for m in milestones:
        story.append(Paragraph(f"&bull;&nbsp; {m}", body_style))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 8))

    # Featured Projects & Case Studies
    story.append(Paragraph("FEATURED PROJECTS &amp; CASE STUDIES", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=6))

    projects = [
        ("Two-Stage LLM Classifier &amp; Vector Query Router", "Next.js 15, TypeScript, Supabase Vector (Pgvector), OpenAI API, Python", [
            "Designed a multi-stage intent classification engine routing queries to cached micro-models vs heavy LLM instances.",
            "Achieved a <b>42% reduction in median API latency</b> and lowered compute token costs while maintaining 99.4% intent accuracy."
        ]),
        ("Computational Predictive Analytics Engine", "Python, PyTorch, Pandas, Scikit-Learn, PCA", [
            "Built a high-variance dataset analytics pipeline using Principal Component Analysis and custom loss scaling functions.",
            "Eliminated model overfitting on complex multidimensional data, achieving benchmark research results."
        ]),
        ("Interactive In-Browser ML Neural Canvas", "HTML5 Canvas, JavaScript, Softmax Heuristics", [
            "Developed a zero-latency client-side digit classifier extracting spatial pixel density features and rendering probability spectrums."
        ]),
        ("Academic Brand Platform", "React, TypeScript, TailwindCSS, Vite", [
            "Engineered responsive promotional platforms and digital media rendering architecture for academic support platforms."
        ])
    ]

    for title, tech, points in projects:
        story.append(Paragraph(f"<b>{title}</b> &nbsp;|&nbsp; <font color='#b15f2c'><b>{tech}</b></font>", body_style))
        for pt in points:
            story.append(Paragraph(f"&bull;&nbsp; {pt}", ParagraphStyle('ProjPt', parent=body_style, leftIndent=10)))
        story.append(Spacer(1, 4))
    story.append(Spacer(1, 6))

    # Technical Skills
    story.append(Paragraph("TECHNICAL SKILLS", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=6))

    skills_data = [
        [Paragraph("<b>Programming Languages:</b>", bold_body), Paragraph("Python, C++, TypeScript, JavaScript, SQL, C, HTML5, CSS3/Sass, Bash", body_style)],
        [Paragraph("<b>Machine Learning &amp; AI:</b>", bold_body), Paragraph("PyTorch, Scikit-Learn, Pandas, NumPy, OpenCV, Vector Embeddings (Pgvector), LLM Prompt Engineering, Intent Routers", body_style)],
        [Paragraph("<b>Web &amp; Cloud Frameworks:</b>", bold_body), Paragraph("Next.js (App Router), React 18/19, TailwindCSS, WebGL/Three.js, Canvas 2D/3D, Node.js, Express, RESTful APIs", body_style)],
        [Paragraph("<b>Databases &amp; DevOps:</b>", bold_body), Paragraph("Supabase, PostgreSQL, Git, GitHub Actions CI/CD, Docker, Vercel, Vite, Linux/Shell", body_style)]
    ]

    t_skills = Table(skills_data, colWidths=[140, 400])
    t_skills.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_skills)

    doc.build(story)
    print("Resume PDF generated successfully.")

if __name__ == "__main__":
    create_resume()
