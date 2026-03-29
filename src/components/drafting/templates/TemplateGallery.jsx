import PropTypes from "prop-types";
import TemplateCard from "./TemplateCard";

TemplateGallery.propTypes = {
  templates: PropTypes.array.isRequired,
  onPreview: PropTypes.func.isRequired,
  onUseTemplate: PropTypes.func.isRequired,
};

export default function TemplateGallery({
  templates,
  onPreview,
  onUseTemplate,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onPreview={onPreview}
          onUseTemplate={onUseTemplate}
        />
      ))}
    </div>
  );
}
