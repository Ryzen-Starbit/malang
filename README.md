### Malang's Site Docs

| Tools | Description |
|-|-|
| Redirector | NA |
| Claims | NA |
| Mail Tool | NA |
| Site Manager | NA |

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
