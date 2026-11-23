
## Code Scanning
After completing a feature or user request, run Veracode security scans on the newly generated code as a last validation step.

### SAST
To run a static scan, package the application:
`veracode package -s . -a`
This generates packaged artifacts that can be scanned by Veracode's static scanner. If multiple items are created, use the artifact generated for the expected package manager.
example

```
[INFO] SUMMARY - Javascript (NpmPackager): "/Users/stsessions/demos/github/sessions-sandbox/verademo-javascript/veracode-auto-pack-verademo-javascript-js.zip"  (Size: 206.3KB, SHA2: 7fad07901f56297564cdb038ec2977d4f40e29860db48e3b141b895b46bcc165)
```

Use the artifact appropriate for the package manger used by a project. If multiple artifacts are available, choose the largest one.

To scan the project, use the cli:
`veracode static scan <file_path> --results-file scan-results.json`

This will create the `scan-results.json` file which will have the static findings. Use those findings to make sure the newly generated code is secure.
