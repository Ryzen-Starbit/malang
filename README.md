<ul id="docList">
  <h1>Docs</h1>
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
                      <li><a href="#Events">Upcoming Event</a></li>
                      <li><a href="#Timeline">Past Event</a></li>
                    </ul>
                  </details>
                </li>
                <li>
                  <details>
                    <summary>Galleries</summary>
                    <ul>
                      <li><a href="#Art-Gallery">Art Gallery</a></li>
                      <li><a href="#Photo-Gallery">Photo Gallery</a></li>
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
          <li>
          <details>
              <summary>Management</summary>
              <ul>
                <li><a href="#">Accounts</a></li>
                <li><a href="#">Claims</a></li>
                <li><a href="#">M-ArUCo</a></li>
                <li><a href="#">Media Kit</a></li>
                <li><a href="#">Redirector</a></li>
              </ul>
            </details>
          </li>
          <li><a href="#site-structure">Site Structure</a></li>
      </details>
    </li>
    <li>
      <details>
        <summary>Tools</summary>
        <ul>
          <li><a href="#Certificate-Tool">Certificate Tool</a></li>
          <li><a href="#Contact-Tool">Contact Tool</a></li>
          <li><a href="#Mail-Tool">Mail Tool</a></li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary>Broadcasts</summary>
        <ul>
          <li><a href="#newsletter-emails">Newsletter Emails</a></li>
          <li><a href="#">Whatsapp Channel</a></li>
          <li><a href="#">Instagram Channel</a></li>
        </ul>
      </details>
    </li>
  </ul>
<hr>
<br>

# Site > Updation

## Events

<h3 id="Events">Managing Upcoming Events</h3>

- Go to `/resrc/data/events.json` and add events like:

```json
[ 
  {
    "name": "EVENT NAME",
    "date": "EVENT DATE",
    "location": "EVENT VENUE",
    "description": "EVENT DESCRIPTION",
    "image": "[/resrc/images/misc/IMAGE] || IMAGE URL",
    "buttons": [
      {
        "text": "ALTERNATE BUTTON TEXT",
        "link": "REDIRECTION LINK",
        "focus": false
      },
      {
        "text": "PRIMARY BUTTON TEXT",
        "link": "REDIRECTION LINK",
        "focus": true
      }
    ]
  }
]
```

---

<h3 id="Timeline">Managing Past Events</h3>

- Go to `/resrc/data/timeline.json` and add events like:

```json
{
    "title": "EVENT TITLE",
    "date": "EVENT DATE",
    "description": "EVENT DESCRIPTION",
    "images": [
      list of paths of images to be added
    ]
  }
```

## Galleries

<h3 id="Art-Gallery">Managing Art Gallery</h3>

- Go to `/resrc/data/artworks.json` and add artwork like:

```json
"0": {
        "title": "ARTWORK TITLE",
        "artist": "ARTIST'S NAME",
        "type": "ARTWORK TYPE"
    }
```
> [!CAUTION]
> Artwork image must be in `.webp` format.
>
> The JSON key must be unique, continued series of existing keys and must match the image name.

> [!NOTE]
> Don't forget to add artwork image in `resrc\images\artworks` folder.
>
> Update the artwork count in `src/scripts/gallery.js`:

```js
        // artwork count and photograph count
        const total = mode === 'artworks' ? 68 : 42;
                                            ^
```

<h3 id="Photo-Gallery">Managing Photo Gallery</h3>

- Go to `/resrc/data/photographs.json` and add artwork like:

```json
"0": {
        "title": "PHOTOGRAPH TITLE",
        "artist": "PHOTOGRAPHER'S NAME",
        "type": "PHOTOGRAPH TYPE"
    }
```
> [!CAUTION]
> Phogograph must be in `.webp` format.
>
> The JSON key must be unique, continued series of existing keys and must match the image name.

> [!NOTE]
> Don't forget to add photograph in `resrc\images\photographs` folder.
>
> Update the photograph count in `src/scripts/gallery.js`:


```js
        // artwork count and photograph count
        const total = mode === 'artworks' ? 68 : 42;
                                                  ^
```

<h1 id="Tools">Malang Tools</h1>

|Tool|CSV Requirements|How to use?|
|-|-|-|
|Certificate Tool|name|[Read](#Certificate-Tool)|
|Contact Tool|contact no.|[Read](#Contact-Tool)|
|Mail Tool|name, email|[Read](#Mail-Tool)|

---

<h3 id="Certificate-Tool">Certificate Tool</h3>

<a href="https://github.com/MalangBvp/Malang-Tools/tree/main/Certificate-tool" target="_blank">GitHub Link</a>


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

<h3 id="Contact-Tool">Contact Tool</h3>

<a href="https://github.com/MalangBvp/Malang-Tools/tree/main/Contact-tool" target="_blank">GitHub Link</a>


For saving bulk contacts to Google contacts, generally useful for adding multiple people to Whatsapp group.

##### Setup

1. Install dependencies

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

2. Enable Google People API

- Create a project in <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>.

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

```sql
8279843949,
1234567890,
```
- Contacts will be created as: `malang2025@1`, `malang2025@2`, etc.

---

<h3 id="Mail-Tool">Mail Tool</h3>

<a href="https://github.com/MalangBvp/Malang-Tools/tree/main/Mail-tool" target="_blank">GitHub Link</a>

Used for sending bulk emails with customised names, template and attachments.

> [!NOTE]
> `email_template.html` is the customizable design template of the email to be sent.

> [!IMPORTANT]
> Always use media like images, posters, etc. from <a href="https://github.com/MalangBvp/media" target="_blank">this repo</a>  using links like:
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

---

# Broadcasts

<h3 id="newsletter-emails">Newsletter Emails</h3>

Send E-mails to <a href="https://docs.google.com/spreadsheets/d/1uz3li0Uif-DtfTobPKj2fxwWTO8AIoWJghAhPCsyve0/" target="_blank">newsletter subscribers</a> via [Mail Tool](#Mail-Tool).