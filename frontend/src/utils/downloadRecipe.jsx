import jsPDF from "jspdf";
import { message } from "antd";

const handleDownload = async (
  recipe,
  servings,
  scaledIngredients,
  setDownloading
) => {
  setDownloading(true);
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter",
    });

    let y = 1; // Starting Y position

    // Add recipe title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(recipe.recipe_name, 1, y);
    y += 0.5;

    // Add author
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(12);
    pdf.text(`Submitted by: ${recipe.user?.full_name || "Unknown User"}`, 1, y);
    y += 0.5;

    // Add info section
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Ready in: ${recipe.prep_time + recipe.cook_time} mins`, 1, y);
    y += 0.3;
    pdf.text(`Serves: ${servings}`, 1, y);
    y += 0.3;
    pdf.text(`Ingredients: ${recipe.ingredients?.length || 0}`, 1, y);
    y += 0.5;

    // Add divider
    pdf.setLineWidth(0.01);
    pdf.line(1, y, pdf.internal.pageSize.getWidth() - 1, y);
    y += 0.5;

    // Add directions
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("DIRECTIONS", 1, y);
    y += 0.4;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    recipe.instructions
      ?.sort((a, b) => a.step_number - b.step_number)
      .forEach((instruction, index) => {
        const lines = pdf.splitTextToSize(
          `${index + 1}. ${instruction.description}`,
          6.5
        );
        pdf.text(lines, 1.5, y);
        y += lines.length * 0.3;
        if (y > 10) {
          pdf.addPage();
          y = 1;
        }
      });

    // Add divider
    pdf.setLineWidth(0.01);
    pdf.line(1, y, pdf.internal.pageSize.getWidth() - 1, y);
    y += 0.5;

    // Add ingredients
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("INGREDIENTS", 1, y);
    y += 0.4;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    scaledIngredients?.forEach((ingredient, index) => {
      // Clean up LaTeX syntax
      const unit = ingredient.unit
        ? ingredient.unit
            .replace(/\\mathrm{~g}/g, "g")
            .replace(/\\mathrm{ml}/g, "ml")
        : "";
      const lines = pdf.splitTextToSize(
        `${index + 1}. ${ingredient.ingredient_name} - ${
          ingredient.amount
        } ${unit}`,
        6.5
      );
      pdf.text(lines, 1.5, y);
      y += lines.length * 0.3;
      if (y > 10) {
        pdf.addPage();
        y = 1;
      }
    });

    pdf.save(`${recipe.recipe_name}.pdf`);
    message.success("Recipe downloaded as PDF");
  } catch (err) {
    message.error("Failed to download recipe");
    console.error("PDF generation error:", err);
  } finally {
    setDownloading(false);
  }
};

export default handleDownload;
