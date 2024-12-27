import os
import xml.etree.ElementTree as ET

def replace_colors_in_svg(folder_path, color_map):
    folder_path = os.path.join(os.path.dirname(__file__), folder_path)
    # Ensure the folder exists
    if not os.path.isdir(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist.")
        return

    # Iterate over all files in the folder
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".svg"):
            file_path = os.path.join(folder_path, file_name)
            
            try:
                # Parse the SVG file
                tree = ET.parse(file_path)
                root = tree.getroot()

                # Namespace handling
                namespace = "http://www.w3.org/2000/svg"
                ET.register_namespace('', namespace)

                # Replace colors in 'style' and 'fill' attributes
                for elem in root.iter():
                    for attr in ['style', 'fill', 'stroke']:
                        if attr in elem.attrib:
                            for old_color, new_color in color_map.items():
                                if old_color in elem.attrib[attr]:
                                    elem.attrib[attr] = elem.attrib[attr].replace(old_color, new_color)

                # Save the modified SVG
                tree.write(file_path, encoding='utf-8', xml_declaration=True)
                print(f"Updated: {file_name}")

            except ET.ParseError as e:
                print(f"Failed to parse '{file_name}': {e}")

if __name__ == "__main__":
    # Example usage
    folder = "stratagems"  # Change to your folder path
    color_replacements = {
        "#de7b6c": "#FF5053",  # Replace red with primary red
        "#5dbcd6": "#6A5FDB",  # Replace blue with amethyst
        "#679552": "#B2AAFF",   # Replace green with Periwinkle
        "#49adc9": "#6A5FDB",   # Replace blue with amethyst
        "#B2AAFF": "#6A5FDB",    # Replace blue with amethyst
    }

    replace_colors_in_svg(folder, color_replacements)
