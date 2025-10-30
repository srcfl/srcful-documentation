---
sidebar_position: 1
slug: /developer/hardware/flashing-zap-firmware
---

# Flashing Zap Firmware

This guide covers the process of flashing Sourceful Zap firmware to ESP32-C3 devices using the sequential flasher tool.

## Overview

The Sourceful Zap flasher is a standalone tool for flashing firmware to ESP32-C3 devices sequentially on a single serial port. It automatically extracts device serial numbers and public keys from the flashed firmware.

## Prerequisites

- **Python 3.8+**
- **USB access** to your serial device
- **ESP32-C3 devices** with USB connector
- **[uv](https://docs.astral.sh/uv/)** package manager (recommended)

## Installation

### Option A: Using uv (Recommended)

```bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone the flasher repository
git clone https://github.com/srcfl/srcful-zap-x-firmware.git
cd srcful-zap-x-firmware

# uv automatically creates venv and installs dependencies
uv sync
```

### Option B: Traditional pip

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Firmware Setup

Place your Sourceful Zap firmware binaries in a directory. Expected structure:

```
c3_1_1_0/          # Or any directory name
├── bootloader.bin
├── partition-table.bin
└── zap-idf.bin    # Main firmware file
```

## Flashing Process

### Quick Start

```bash
# Fast mode - auto-detects everything
uv run flasher.py

# Quiet mode for production
uv run flasher.py --quiet

# Specify binary directory
uv run flasher.py --bin-dir c3_1_1_0
```

### Advanced Usage

```bash
# Safer mode with flash erase (slower but more reliable)
uv run flasher.py --erase

# Specify port manually
uv run flasher.py --port /dev/cu.usbmodem101

# Manual file specification
uv run flasher.py --files \
  0x0:c3_1_1_0/bootloader.bin \
  0x8000:c3_1_1_0/partition-table.bin \
  0x10000:c3_1_1_0/zap-idf.bin

# Debug mode to test setup
uv run flasher.py --debug
```

### Available Options

- `--list-ports` — Show available serial ports
- `--chip esp32c3` — Force chip type (usually auto-detected)
- `--verify-flash` — Verify flash after writing
- `--timeout 30` — Serial read timeout in seconds
- `--output-base my_batch` — Custom output file prefix
- `--quiet` — Minimal output for production use
- `--erase` — Perform flash erase before writing (slower but more reliable)

## Flashing Workflow

1. **Connect** ESP32-C3 device via USB to computer
2. **Monitor CSV** file to verify information is being captured
3. **Watch terminal** for "Device flashed successfully!" message
4. **Flash** - Tool automatically erases (optional), flashes firmware, and resets
5. **Extract** - Captures serial number and public key from device output
6. **Save** - Appends results to CSV file
7. **Disconnect** device and connect the next one
8. **Repeat** until done (Ctrl+C to stop)

## Output Files

The tool creates timestamped files:

**CSV File: `flash_results_YYYYMMDD_HHMMSS.csv`**
- Columns: `ecc_serial`, `mac_eth0`, `mac_wlan0`, `helium_public_key`, `full_public_key`
- Ready for import into spreadsheets
- Send completed CSV file to provisioning team

**JSON File: `flash_results_YYYYMMDD_HHMMSS.json`**
- Detailed per-device information including full serial output

### Example CSV Output

```csv
ecc_serial,mac_eth0,mac_wlan0,helium_public_key,full_public_key
zap-000058b868e385a0,,,,1d28faa8df6ed0b194839503c49c74aeff710825d45f7f4f8eb328963b9a6634...
zap-0000c4458290a994,,,,df592f4cbd88f2aab7abad0c750cad0b822dc28bd649b6450d3e40668ced4015...
```

## Performance

- **Fast mode** (default): ~15-20 seconds per device
- **With erase**: ~25-30 seconds per device
- **Bottlenecks**: Device boot time (~10s) and serial communication

## Features

- 🚀 **Fast**: No flash erase by default (2-3x faster)
- 📁 **Standalone**: Works with binary files, no PlatformIO required
- 🔍 **Auto-detection**: Automatically finds binary files and serial ports
- 📊 **Data extraction**: Captures device serial numbers and public keys
- 📝 **Output formats**: CSV and JSON result files
- 🔄 **Sequential processing**: Flash multiple devices one by one

## Troubleshooting

### Permission Issues

**macOS**: No additional setup needed

**Linux**: Add user to dialout group
```bash
sudo usermod -aG dialout $USER
# Then logout and login again
```

### Common Issues

**Port busy**
- Close other serial monitors, Arduino IDE, or PlatformIO terminals

**Auto-detect fails**
- Use `--port /dev/cu.usbmodem101` to specify manually
- Use `--list-ports` to see available ports

**No device output**
- Try `--erase` for a clean flash
- Check USB cable and connection

**Wrong binary files**
- Use `--debug` to check file detection
- Verify binary directory structure

### Debug Commands

```bash
# Test setup without flashing
uv run flasher.py --debug

# Test device connection
uv run flasher.py --test-connection --port /dev/cu.usbmodem101

# List available ports
uv run flasher.py --list-ports
```

## File Structure

```
zap-flasher/
├── flasher.py              # Main script
├── pyproject.toml          # uv project configuration
├── requirements.txt        # Python dependencies
├── README.md              # Documentation
├── c3_1_1_0/              # Firmware binaries
│   ├── bootloader.bin
│   ├── partition-table.bin
│   └── zap-idf.bin
└── flash_results_*.csv    # Generated result files
```

## Development

```bash
# Install in development mode
uv sync --dev

# Run tests (if any)
uv run pytest

# Format code
uv run black flasher.py

# Type checking
uv run mypy flasher.py
```

## Next Steps

After flashing devices:
1. Send CSV file to provisioning team
2. See [Packaging Guide](/developer/hardware/packaging) for packaging instructions

## Related Documentation

- [Zap for Developers](/developer/zap-for-developers) - Understanding the Zap platform
- [Data Models](/developer/data-models) - Device and DER hierarchy
