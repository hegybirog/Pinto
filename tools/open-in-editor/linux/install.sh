#!/bin/bash

# This shell script sets open-editor.sh as handler for editor:// protocol

matches=0
while read -r line
do
	if [ "editor=" == "${line:0:7}" ]; then
		matches=1
		break
	fi
done < "open-editor.sh"

if [ "$matches" == "0" ]; then
	echo -e "\e[31;1mError: it seems like you have not set command to run your editor."
	echo -e "Before install, set variable \`\$editor\` in file \`open-editor.sh\`.\e[0m"
	exit 1
fi

# --------------------------------------------------------------

echo "[Desktop Entry]
Name=Pinto Open Editor
Exec=Pinto-openeditor.sh %u
Terminal=false
NoDisplay=true
Type=Application
MimeType=x-scheme-handler/editor;" > Pinto-openeditor.desktop

chmod +x open-editor.sh
chmod +x Pinto-openeditor.desktop

sudo cp open-editor.sh /usr/bin/Pinto-openeditor.sh
sudo xdg-desktop-menu install Pinto-openeditor.desktop
sudo update-desktop-database
rm Pinto-openeditor.desktop

echo -e "\e[32;1mDone.\e[0m"
