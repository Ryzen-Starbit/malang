### Docs
<img src="https://api.visitorbadge.io/api/visitors?path=multiverseweb2%2malang%20&countColor=%23263759&style=flat"
                alt="Visitors Count">
                <img alt="Website Status"
                src="https://img.shields.io/website?url=https%3A%2F%2Fmalangbvp.in/%2F&up_message=ok&up_color=%2324ad29&down_message=not%20ok&down_color=red&style=flat">
            
Docs
  <ul>
    <li>
      <details>
        <summary>Site</summary>
        <ul>
          <li>
            <details>
              <summary>Updation</summary>
              <ul>
                <li>
                  <details>
                    <summary>Events</summary>
                    <ul>
                      <li><a href="#">Adding Upcoming Event</a></li>
                      <li><a href="#">Adding Past Event</a></li>
                    </ul>
                  </details>
                </li>
                <li>
                  <details>
                    <summary>Galleries</summary>
                    <ul>
                      <li><a href="#">Art Gallery</a></li>
                      <li><a href="#">Photo Gallery</a></li>
                    </ul>
                  </details>
                </li>
                <li><a href="#">Projects</a></li>
                <li>
                  <details>
                    <summary>Members</summary>
                    <ul>
                      <li><a href="#">Core Members</a></li>
                      <li><a href="#">Malang Alumni</a></li>
                    </ul>
                  </details>
                </li>
              </ul>
            </details>
          </li>
                <li><a href="#">Accounts</a></li>
                <li><a href="#">Claims</a></li>
                <li><a href="#">M-ArUCo</a></li>
                <li><a href="#">Media Kit</a></li>
                <li><a href="#">Redirector</a></li>
                <li><a href="#">Site Structure</a></li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary>Tools</summary>
        <ul>
          <li><a href="#">Certificate Tool</a></li>
          <li><a href="#">Contact Tool</a></li>
          <li><a href="#">Mail Tool</a></li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary>Broadcasts</summary>
        <ul>
          <li><a href="#">Newsletter Emails</a></li>
          <li><a href="#">Whatsapp Channel</a></li>
          <li><a href="#">Instagram Channel</a></li>
        </ul>
      </details>
    </li>
  </ul>



### Managing Events Page

- Go to `/resrc/data/events.json` and add events like:

```json
[ 
  {
    "name": "[EVENT NAME]",
    "date": "[EVENT DATE]",
    "location": "[EVENT VENUE]",
    "description": "[EVENT DESCRIPTION]",
    "image": "[/resrc/images/misc/IMAGE] || IMAGE URL",
    "buttons": [
      {
        "text": "[ALTERNAMTE BUTTON TEXT]",
        "link": "[REDIRECTION LINK]",
        "focus": false
      },
      {
        "text": "[PRIMARY BUTTON TEXT]",
        "link": "[REDIRECTION LINK]",
        "focus": true
      }
    ]
  }
]
```

## Malang Tools

|Tool|CSV Requirements|How to use?|
|-|-|-|
|Certificate Tool|name|[Read](#certificate-tool)|
|Contact Tool|contact no.|[Read](#contact-tool)|
|Mail Tool|name,email|[Read](#mail-tool)|

---

### Certificate Tool

For creating bulk certificated with custom names and font-style.

```python
# sample configuration -----------------------------------------------------------------------
output_dir = "Certificate-tool/certificates"
# Certificate template (PNG/JPG)
template_path = "Certificate-tool/certificate_template.jpg"
#font style
pdfmetrics.registerFont(TTFont('NoticiaText', 'Certificate-tool/NoticiaText-BoldItalic.ttf'))
# size
PAGE_WIDTH, PAGE_HEIGHT = landscape(A4)
# position of the name on the certificate
NAME_X = PAGE_WIDTH / 1.6
NAME_Y = PAGE_HEIGHT / 1.8
FONT_SIZE = 42
data="Mail-tool/shortlisted.csv"
#--------------------------------------------------------------------------------------------
```

- **output_dir:** path of directory where certificates are saved
- **template_path:** path of certificate template. 

> [!CAUTION]
> Template must be `.png` or `.jpg`.

- Store `.ttf` file in `Certificate-tool/` for **custom font** and refer it here

```python
#font style
pdfmetrics.registerFont(TTFont('NoticiaText', 'Certificate-tool/NoticiaText-BoldItalic.ttf'))
```

- Set **NAME_X** and **NAME_Y** for position of name on the certificate.
- **FONT_SIZE:** Sets the size of name text.
- **data:** Is the path to the file containing names.

---

### Contact Tool

For saving bulk contacts to Google contacts, generally useful for adding multiple people to Whatsapp group.

##### Setup

1. Install dependencies

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

2. Enable Google People API

- Create a project in [Google Cloud Console](https://console.cloud.google.com/)

- Enable _Google People API_.

- Create OAuth credentials (Desktop app) and replace `credentials.json`.

##### Configurations (edit in add_contacts.py)

```python
# configurations ---------------------------------------------------
contacts_file = 'Contact-tool/contacts.csv'   # CSV file path
prefix = "malang2025@"                        # Contact name prefix
#-------------------------------------------------------------------
```

- `contacts.csv` → one phone number per line, like:

```csv
8279843949,
1234567890,
```
- Contacts will be created as: `malang2025@1`, `malang2025@2`, etc.

---

### Mail Tool

Used for sending bulk emails with customised names, template and attachments.

> [!NOTE]
> `email_template.html` is the customizable design template of the email to be sent.

> [!IMPORTANT]
> Always use media like images, posters, etc. from [this repo](https://github.com/MalangBvp/media) using links like:
```
https://raw.githubusercontent.com/MalangBvp/media/refs/heads/main/images/malang.webp
```

```python
# ------------- sample configurations --------------
subject = "Malang: Welcome to the club! 🥳"
csv_path = "Mail-tool/shortlisted.csv"
attachment_dir = "Certificate-tool/certificates"
#---------------------------------------------------
```

- **subject:** Subject of the emails to be sent.
- **csv_path:** Path of file that contains names and emails.
- **attachment_dir:** Path of directory where attachments are stored.
