// This is necessary for local backend development
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  window.CMS_MANUAL_INIT = true;
  fetch('/admin/config.yml')
    .then(response => response.text())
    .then(yamlText => {
      const yaml = window.decapCmsUtil.parseYaml(yamlText);
      
      // Override backend for local development
      yaml.backend = {
        name: 'test-repo',
      };
      
      window.CMS.init({ config: yaml });
    });
}