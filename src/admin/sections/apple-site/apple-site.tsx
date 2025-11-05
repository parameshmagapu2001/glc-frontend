'use client';

// ----------------------------------------------------------------------

export default function AppleSiteView() {
  const content = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "M3WB7NFTP3.com.mrmilkman.akshaykalpa",
          "paths": [
            "*"
          ]
        }
      ]
    }
  };
  return (
    <pre style={{ margin: 0, padding: 0 }}>{JSON.stringify(content, null, 2)}</pre>
  );
}
